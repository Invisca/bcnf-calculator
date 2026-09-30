# BCNF Lab
A browser-only JavaScript calculator that accepts multiple relations and displays candidate keys, projected functional dependencies, attribute closures, recursive lossless decomposition, and dependency-preservation checks.

## Run
Open `index.html` in a browser. No installation, server, or build needed.

## Publish on GitHub Pages
1. Create a public repository named `bcnf-calculator` on GitHub.
2. Upload `index.html`, `core.js`, `app.js`, and `style.css` directly into the repository root (not inside a folder). README and tests are optional.
3. Commit the files to `main`.
4. Open **Settings → Pages**. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
5. When deployment completes, use the site address shown in Pages settings: `https://YOUR-USERNAME.github.io/bcnf-calculator/`.

## Input
Attributes: `A, B, C` or `R(A, B, C)`.
Dependencies: one per line, such as `A -> B` and `B -> C`.
For multi-letter names, use commas: `student_id, course_id -> grade`.
For single-letter attributes only, `AB -> CD` shorthand is also supported.
Use `∅ -> A` for an empty determinant. Leave dependencies blank for no nontrivial FDs.

Each input relation's dependencies are analyzed independently.

## Algorithm and limits
Computes closures under the original FD set and intersects them with each subrelation. Enumerating all determinant subsets computes the full projection of F+ and detects implied BCNF violations; merely filtering original FDs would be incorrect. Candidate keys are inclusion-minimal superkeys. Splits use X → (X+ ∩ R) − X; their intersection X determines the first relation, establishing losslessness. Dependency preservation is tested by computing original FD closures under the union of final projected FDs.

The exhaustive search is exponential, so each original relation is limited to 12 attributes. The decomposition is deterministic, but other valid BCNF decompositions may exist. Enter only dependencies known to hold; the app does not infer FDs from sample data.

## Test
Run `node test.js`.
