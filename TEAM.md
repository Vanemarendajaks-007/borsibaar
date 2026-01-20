# Team
Vanemarendajaks-007

## Mentor

| Name          | Email                  | GitHub        |
|--------------|------------------------|---------------|
| Oskar Pihlak | oskar.pihlak@gmail.com | @oskarpihlak  |

## Developers

| Name              | Email                       | GitHub           |
|------------------|-----------------------------|------------------|
| Aleksandr Lerko  | alexandr.lerko@gmail.com    | @allerk          |
| Andres Haabu     | andres.haabu@gmail.com      | @andreshaaa      |
| Maksim Maksimov  | dev.arendaja@gmail.com      | @4matic          |
| Stefan Linde     | stefanlinde1995@gmail.com   | @stefanlinde95   |
| Madis Bobrovski  | madis.bobrovski@gmail.com   | @madisbobo       |


---

# Workflow

## Project management (GitHub Projects / Issues)

- We track work in our GitHub Project board using tickets (Issues).
- Every change should be linked to a ticket.

### Taking work
- Pick an existing ticket from the board (or create one).
- Assign the ticket to yourself (or the developer who will work on it).
- Move the ticket to the correct status (e.g. **Todo → In Progress → In Review → Done**).

## Branching

- We use only:
  - `main` (protected, always stable / releasable)
  - short-lived feature branches (`feature/*`, `bugfix/*`, etc.)

### Creating a branch
- Always branch off `main`
- Branch naming must include the ticket number:
  - `feature/#26-short-description`
  - `bugfix/#31-fix-null-pointer`
  - `chore/#40-update-dependencies`

## Pull requests & merging

- All work is done in a feature branch.
- Merge `feature/*` → `main` **via Pull Request**.
- PR review is required before merging.

## Main branch protection

- `main` is protected:
  - PR required
  - at least one approval required
  - no direct pushes
  - (recommended) required status checks (CI) must pass

---

# Recommended conventions

## PR guidelines
- Keep PRs small and focused (one ticket / one topic).
- PR title format: `#26 Short description`
- PR description should include:
    - What changed + why
    - How to test (steps)

## Definition of Done (DoD)
A ticket can be marked **Done** when:
- The change is merged to `main`
- Basic testing is done (manual or automated)
- No known broken flows are left behind
- Ticket/PR links are present and clear

## Commit messages (lightweight)
- Prefer meaningful commits (not “fix stuff”).
- Example: `#26 - Add customer search filter`