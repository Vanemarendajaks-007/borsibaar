"use client";

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import Image from "next/image";

type Category = { id: number; name: string; organizationId?: number };
export type InvDto = {
  id: number;
  organizationId: number;
  productId: number;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  basePrice: number;
  updatedAt: string;
};

const money = (n: number) =>
  new Intl.NumberFormat("et-EE", {
    style: "currency",
    currency: "EUR",
  }).format(n);

const sponsors = [
  { name: "Red Bull", logo: "/redbull.svg" },
  { name: "itük", logo: "/ituk_long_nottu_red.svg" },
  { name: "alecoq", logo: "/alecoq.svg" },
  { name: "insük", logo: "/insyk.png"},
  { name: "anora", logo: "/anora-group-logo-white-CMYK.png"}
];

export default function ClientProductsByCategory() {
  const [cats, setCats] = useState<Category[]>([]);
  const [groups, setGroups] = useState<Record<string, InvDto[]>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      try {
        const organizationId = 2;

        const cRes = await fetch(
          `/api/backend/categories?organizationId=${organizationId}`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );
        if (!cRes.ok) throw new Error(`Categories HTTP ${cRes.status}`);
        const cJson = await cRes.json();
        const categoryList: Category[] = Array.isArray(cJson)
          ? cJson
          : cJson?.items ?? cJson?.content ?? [];

        if (!alive) return;
        setCats(categoryList);

        const fetches = categoryList.map(async (c) => {
          const res = await fetch(
            `/api/backend/inventory?categoryId=${c.id}&organizationId=${organizationId}`,
            {
              cache: "no-store",
              credentials: "include",
            }
          );
          if (!res.ok)
            throw new Error(`Inventory HTTP ${res.status} (cat ${c.id})`);
          const j = await res.json();
          const arr: InvDto[] = Array.isArray(j)
            ? j
            : j?.items ?? j?.content ?? [];
          return [c.name, arr] as const;
        });

        const results = await Promise.all(fetches);
        if (!alive) return;

        const grouped = Object.fromEntries(
          results.filter(([, arr]) => arr.length > 0)
        );
        setGroups(grouped);
        setErr(null);
      } catch (e) {
        if (!alive) return;
        setErr(e instanceof Error ? e.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
    const refreshInterval = setInterval(load, 1000 * 15);
    return () => {
      clearInterval(refreshInterval);
      alive = false;
    };
  }, []);

  const totalItems = Object.values(groups).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="w-full bg-[#141224] text-white px-2 py-2 sm:px-4 sm:py-4 flex flex-col items-stretch justify-center gap-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        {err && (
          <div className="rounded-xl border border-red-700 bg-red-950/60 px-4 py-3 text-sm text-red-200">
            {err}
          </div>
        )}

        <section className="rounded-2xl bg-[#1b1830] border border-[#2a2640] p-3 sm:p-4 flex flex-col w-full lg:basis-2/3 min-w-0">
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wide">
              Products by Category
            </h2>
          </div>

          <div className="columns-1 min-[1800px]:!columns-2 gap-4 min-[1800px]:max-h-[90vh]" style={{ "columnFill": "auto" }}>
            {loading && !totalItems && (
              <div className="col-span-full flex h-40 items-center justify-center text-lg text-[#a7a3c7]">
                Loading…
              </div>
            )}

            {cats
              .filter((c) => groups[c.name]?.length)
              .map((c) => {
                const items = groups[c.name];
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl bg-[#201c31] border border-[#2a2640] p-2 sm:p-3 w-full [&:not(:first-child)]:mt-4"
                  >
                    <div className="mb-2 flex items-center justify-between break-inside-avoid">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-purple-400 to-fuchsia-400" />
                        <h3 className="text-[10px] sm:text-xs lg:text-sm font-semibold tracking-[0.18em] text-[#e9e6ff] uppercase">
                          {c.name}
                        </h3>
                      </div>
                      <span className="text-xs text-[#8b88a9]">
                        {items.length} items
                      </span>
                    </div>

                    <div className="overflow-x-auto -mx-2 px-2">
                    <table className="w-full text-xs lg:text-sm border-separate border-spacing-y-1 break-before-avoid">
                      <thead className="break-after-avoid">
                        <tr className="text-[8px] sm:text-[9px] lg:text-[10px] xl:text-[12px] uppercase tracking-[0.16em] text-[#7a7690]">
                          <th className="px-1 sm:px-2 py-1 text-left">Product</th>
                          <th className="px-1 sm:px-2 py-1 text-right">Price</th>
                          <th className="px-1 sm:px-2 py-1 text-right hidden min-[400px]:table-cell">Δ%</th>
                          <th className="px-1 sm:px-2 py-1 text-right hidden sm:table-cell">Base</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items
                          .slice()
                          .sort((a, b) =>
                            a.productName.localeCompare(b.productName)
                          )
                          .map((p) => {
                            const diff = p.unitPrice - p.basePrice;
                            const diffPct =
                              p.basePrice !== 0
                                ? (diff / p.basePrice) * 100
                                : 0;

                            const isUp = diff > 0;
                            const isDown = diff < 0;

                            return (
                              <tr
                                key={p.productId}
                                className="bg-[#251f3a] hover:bg-[#2b2446] transition-colors break-inside-avoid"
                              >
                                <td className="px-1 sm:px-2 py-1">
                                  <span className="font-medium truncate block text-sm sm:text-base">
                                    {p.productName}
                                  </span>
                                  <p className="hidden min-[400px]:block">{p.description}</p>
                                </td>
                                <td className="px-1 sm:px-2 py-1 text-right tabular-nums">
                                  {money(p.unitPrice)}
                                </td>
                                <td
                                  className={clsx(
                                    "px-1 sm:px-2 py-1 text-right tabular-nums font-semibold whitespace-nowrap hidden min-[400px]:table-cell",
                                    isUp && "text-emerald-400",
                                    isDown && "text-red-400",
                                    !isUp &&
                                    !isDown &&
                                    "text-[#8b88a9]"
                                  )}
                                >
                                  {diff === 0 ? (
                                    "—"
                                  ) : (
                                    <>
                                      {diff > 0 ? "▲" : "▼"}{" "}
                                      {Math.abs(diffPct).toFixed(1)}%
                                    </>
                                  )}
                                </td>
                                <td className="px-1 sm:px-2 py-1 text-right tabular-nums text-[#c2bedc] hidden sm:table-cell">
                                  {money(p.basePrice)}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    </div>
                  </div>
                );
              })}

            {!totalItems && !loading && (
              <div className="col-span-full flex h-40 items-center justify-center text-lg text-[#a7a3c7]">
                No products to display
              </div>
            )}
          </div>
        </section>

        {/* PAREM – graafik samas boardis */}
        <section className="rounded-2xl border border-[#2a2640] bg-[#1b1830] p-2 sm:p-3 lg:p-4 flex flex-col gap-2 sm:gap-3 lg:gap-4 w-full lg:basis-1/3 min-w-0 overflow-hidden">
          <header className="flex flex-col gap-2 text-center justify-between pb-2 sm:pb-4 overflow-hidden">
            <div className="h-[50px] sm:h-[70px] lg:h-[90px] xl:h-[110px] w-full flex justify-center items-center overflow-hidden">
              <img
                src="/tudengibaarlogo.png"
                alt="Tudengibaar"
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
          </header>
          <div className="mb-2 sm:mb-3 flex items-center justify-between">
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-wide">
              Price History
            </h2>
          </div>
          <Chart groups={groups} />
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 lg:gap-5 rounded-2xl sm:rounded-full bg-[#191530] px-2 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 mx-0 sm:mx-2 lg:mx-3 my-1 sm:my-2 border border-[#2a2640]">
            <span className="text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-[#8b88a9]">
              Sponsored by
            </span>
            {sponsors.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-center h-5 w-12 sm:h-6 sm:w-16 md:h-8 md:w-20 lg:h-10 lg:w-28"
              >
                <Image
                  src={s.logo}
                  alt={s.name}
                  width={120}
                  height={40}
                  className="max-h-5 sm:max-h-6 md:max-h-8 lg:max-h-10 max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER – sponsorid, aga ikka sama kaardi sees */}
      <footer className="mt-10 flex justify-center hidden">

      </footer>
    </div>
  );
}
