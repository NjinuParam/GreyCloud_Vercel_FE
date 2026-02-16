# GreyCloud Platform — End-User Guide (Navigation + Depreciation)

This README is intentionally end-user focused (developer content removed) so it can be ingested into a RAG/embedding pipeline. It emphasizes navigation and clear, actionable instructions for depreciation, onboarding, asset and order flows.

Quick overview
- Purpose: manage rental assets, sync asset categories, run depreciation and post journals, and create rental orders that push invoices to Sage.
- Audience: Company Admins and Company Users who operate the platform (setup, run depreciation, create orders).

Registration process (what to expect)
- When registering a new account (`(auth)/register`), the user will be prompted to enter their Sage (SageOne) integration credentials to enable asset and customer syncing.
- After entering credentials the platform will fetch available Sage companies associated with those credentials. The user must select one or more Sage companies to onboard into GreyCloud.
- Billing: the platform bills per-company in blocks of five companies. Charges accumulate and are invoiced at the end of the month (billing details and invoice delivery are handled by the platform billing system).

Registration steps (summary)
1) Navigate to `(auth)/register` and fill the registration form.
2) Provide Sage credentials when prompted and submit.
3) The system will display a list of Sage companies found — select one or more companies to onboard.
4) Confirm selection and complete registration. The chosen companies will be created in GreyCloud and your account will be associated with them.
5) Billing note: onboarding more companies increases your billing block usage; the platform groups companies into 5-company blocks for monthly billing.

Navigation — where users find key pages
The app routes are under `src/app/`. Use these pages to perform common tasks:

- Authentication
  - `(auth)/login` — Sign in
  - `(auth)/register` — Company registration / onboarding
  - `(auth)/manage-password/*` — Forgot / reset / change password

- Company / Dashboard
  - `(site)/company-picker` — Switch between companies you have access to
  - `(site)/dashboard` — Company dashboard (summary, quick links)

- Company configuration & settings
  - `dashboard/(dashboard-displays)/company/settings` — Company accounting settings (depreciation journals, depreciation start date)

- Asset & category management
  - `dashboard/(dashboard-displays)/company-user-admin/add-asset-category` — Add or map asset categories
  - `dashboard/(dashboard-displays)/company-user-admin/add-asset-location` — Add locations
  - Assets list and details — (look under dashboard components / assets)

- Depreciation management
  - `dashboard/(dashboard-displays)/company-user-admin/manage-depreciation-groups` — View/manage depreciation groups
  - `dashboard/(dashboard-displays)/company-user-admin/add-depreciation-group` — Create a depreciation group (name + rate)
  - `dashboard/(dashboard-displays)/company-user-admin/add-depreciation-history` — Add or adjust depreciation history for an asset

- Orders & invoicing
  - Orders list / create (order management flows are under dashboard/order components)
  - Invoice push to Sage — occurs when an order is created; check order detail for status/reconciliation

Step-by-step: How to set up and run depreciation (end-user focused)
1) Verify company accounting settings
   - Open: `dashboard/(dashboard-displays)/company/settings`
   - Ensure the company has Depreciation Journal Codes configured (Depreciation journal and Accumulated Depreciation journal) and that Depreciation Start Date is set if required.

2) Map Asset Categories to Depreciation Groups
   - Open: `manage-depreciation-groups` and `add-asset-category` pages.
   - Create depreciation groups with the correct rate (e.g., 20% p.a.), and assign each asset category to the appropriate group.
   - Notes: Mapping is Asset Category -> Depreciation Group (rate). This mapping drives calculations.

3) Confirm assets are synced/imported
   - Assets and categories are typically pulled from the connected accounting/source system (Sage). Use the assets list in the dashboard to confirm imported assets and that each asset has an assigned category.

4) Run the depreciation calculation
   - Trigger the depreciation run from the Depreciation UI (look for "Run Depreciation" or similar in the Depreciation area).
   - The system calculates depreciation per asset based on the asset's category -> group rate and the configured start date/life.

5) Review depreciation results
   - After the run, review the calculated amounts per-asset and the aggregated totals by depreciation group.
   - Use `add-depreciation-history` to view or adjust historical entries for specific assets if necessary.

6) Post depreciation journals
   - If satisfied with calculations, use the Post Journals action to push aggregated journal entries to the accounting system.
   - Journals are typically batched/grouped by depreciation group (category) so they post as aggregated entries.

IMPORTANT: Depreciation journals are NOT posted automatically by running a calculation. After running depreciation you must review the results and click the Post (or Post + Review) action to publish the journals to Sage. The review step allows you to inspect grouped journal lines before they are sent.

7) Reconcile and verify in accounting (Sage)
   - Verify posted journals and accumulated depreciation balances in Sage. If journals fail, check error messages on the posting action and ensure the company's Sage credentials and journal codes are correct.

Common pitfalls & troubleshooting (end-user tips)
- Missing category mapping: assets without a mapped depreciation group will not depreciate — ensure every asset category is mapped.
- Incorrect rates: check that the depreciation group rate is correct and that the depreciation start date is set correctly per company.
- Posting failures: verify Sage credentials and that journal codes exist and are correct in the company settings.
- Partial runs: if interrupted, check the depreciation history and rerun for the missing period; use the Add Depreciation History page to patch entries.

Orders & invoice flow (concise)
- Creating an order for a rental asset will create a corresponding invoice pushed to Sage (if integration is configured).
- If invoice creation fails, the order will remain pending — check order detail for failure reasons and retry invoice push after resolving integration issues.

Preparing this content for RAG ingestion
- This README is trimmed of developer setup steps and focuses on navigation and user workflows so it produces clean, actionable embeddings for retrieval-augmented generation.

Full page map (concise list)
- Authentication
  - `(auth)/login`
  - `(auth)/register`
  - `(auth)/manage-password/*`
- After-login
  - `(site)/company-picker` (Company Picker)
  - `(site)/dashboard`
- GreyCloud admin
  - `dashboard/(dashboard-displays)/greycloud-admin/add-company`
  - `dashboard/(dashboard-displays)/greycloud-admin/manage-companies`
  - `dashboard/(dashboard-displays)/greycloud-admin/add-admin`
  - `dashboard/(dashboard-displays)/greycloud-admin/manage-admins`
- Company admin & user
  - `dashboard/(dashboard-displays)/company/settings`
  - `dashboard/(dashboard-displays)/company-user-admin/manage-assets`
  - `dashboard/(dashboard-displays)/company-user-admin/add-asset`
  - `dashboard/(dashboard-displays)/company-user-admin/add-asset-category`
  - `dashboard/(dashboard-displays)/company-user-admin/add-asset-location`
  - `dashboard/(dashboard-displays)/company-user-admin/manage-depreciation-groups`
  - `dashboard/(dashboard-displays)/company-user-admin/add-depreciation-group`
  - `dashboard/(dashboard-displays)/company-user-admin/add-depreciation-history`
  - `dashboard/(dashboard-displays)/company-user-admin/manage-users`
- Orders & customers
  - `dashboard/(dashboard-displays)/orders/create`
  - `dashboard/(dashboard-displays)/orders/show`
  - `dashboard/(dashboard-displays)/customers/create`
  - `dashboard/(dashboard-displays)/customers/show`

Company Admin features (what you can do)
- Create and complete company registration; add Company Admins and users.
- Configure Sage accounting integration and set Depreciation and Accumulated Depreciation journal codes.
- Import and review asset categories and assets from Sage.
- Create depreciation groups (name + rate) and map asset categories to groups.
- Run depreciation calculations, review per-asset and grouped totals, and adjust depreciation history.
- Post aggregated depreciation journals to Sage and reconcile balances.
- Create rental orders for assets and push invoices to Sage; monitor invoice and order reconciliation.

Post-login journey — Company Picker (detailed)
- Why it exists: users often have access to multiple Company Profiles. The Company Picker lets you choose which company you will operate under for the session.
- What the page shows: a selectable list of Company Profiles (name, short identifiers); a "Continue" action sets the company for the session.
- What happens after selection: the session's `loggedInCompanyId` is set and you are redirected to the company `dashboard`. Company-level menus and data (settings, assets, depreciation groups) will reflect the selected company.
- Practical tip: always confirm you are operating in the correct Company Profile before running depreciation or posting journals.

Onboarding a new company — step-by-step (for Company Admins)
1) Create the company record
   - Use platform admin `greycloud-admin/add-company` or have the company self-register via `(auth)/register`.
2) Add at least one Company Admin
   - Use `company-user-admin/add-user` or `greycloud-admin/add-admin` to grant admin rights.
3) Configure accounting integration
   - Open `company/settings` and enter Sage credentials/company id; set Depreciation and Accumulated Depreciation journal codes and Depreciation Start Date.
4) Import asset categories & assets
   - Trigger asset/category sync from the Sage integration; verify imported categories under `add-asset-category` and assets under `manage-assets`.
5) Create depreciation groups and map categories
   - In `manage-depreciation-groups` create groups and link each asset category to a group (Asset Category -> Depreciation Group).
6) Verify asset mappings
   - Ensure every asset has a category and that categories are mapped to depreciation groups.
7) Run a depreciation calculation
   - Use the Depreciation UI to calculate depreciation for the desired period; review results.
8) Post journals to Sage
   - Post aggregated journals; verify in Sage and resolve any posting errors.
9) Test order & invoice flow
   - Create a rental order and confirm invoice push to Sage; verify reconciliation.

End-user troubleshooting highlights
- Assets not depreciating: check category->group mapping and start date.
- Journal posting failures: verify Sage credentials and that configured journal codes exist in Sage.
- Invoice push failures: check order detail for error responses from Sage and retry after fixes.

Task-specific step-by-step guides (Company Admin)
Below are short, actionable guides (with routes) for common Company Admin tasks. Use these as checklists when performing each action.

1) Create a Depreciation Group
    - Open: `dashboard/(dashboard-displays)/company-user-admin/add-depreciation-group`
    - Steps:
       1. Click "Add Depreciation Group".
       2. Enter a descriptive name (e.g., "Plant & Equipment - 20% p.a.").
       3. Enter the depreciation rate (annual %, e.g., 20).
       4. Save. The new group will appear under `manage-depreciation-groups` where you can assign categories.
    - Notes: Depreciation groups define the rate used by assets mapped via their category.

2) Run Depreciation
    - Open: `dashboard/(dashboard-displays)/company-user-admin/manage-depreciation-groups` or the Depreciation area in the dashboard where "Run Depreciation" is available.
    - Steps:
       1. Confirm company settings (`company/settings`) have correct Depreciation Journal Code and Accumulated Depreciation Journal Code and Depreciation Start Date.
       2. Ensure categories are mapped to depreciation groups.
       3. Select the period (month/year) to run depreciation for.
       4. Click "Run Depreciation".
       5. Review calculation results (per-asset and group totals).
       6. If correct, click "Post Journals" to push aggregated journal entries to Sage.
    - Notes: Runs compute depreciation by asset using its category->group rate; posting is typically batched by group.
         - IMPORTANT: Calculations do not post journals automatically. Use the Post + Review (or Post Journals) action to review and then publish journals to Sage.

3) Add an Asset (local/manual — does NOT push to Sage)
    - Open: `dashboard/(dashboard-displays)/company-user-admin/add-asset` or `company-user/add-asset` (depending on permissions).
    - Steps:
       1. Click "Add Asset".
       2. Fill required fields: Asset Name, Category (select an existing category), Purchase Date, Cost, Location, and any tag/identifier.
       3. (Optional) Attach photos or notes.
       4. Save. The asset will be stored in the platform but not pushed to Sage.
    - Notes: Use this for assets you want tracked in the platform without creating/updating a Sage asset record.

4) Add an Asset Category (pushed to Sage)
    - Open: `dashboard/(dashboard-displays)/company-user-admin/add-asset-category` or `company-user/add-asset-category`.
    - Steps:
       1. Click "Add Asset Category".
       2. Enter the category name and any mapping to your Sage asset category if shown.
       3. Save. The category will be created locally and pushed to Sage via the integration (verify under Sage or assets sync logs).
       4. After creation, map the category to a Depreciation Group in `manage-depreciation-groups`.
    - Notes: Categories are the key connection between Sage asset classifications and platform depreciation groups.

5) Add a Customer
    - Open: `dashboard/(dashboard-displays)/customers/create`
    - Steps:
       1. Click "Create Customer".
       2. Enter customer details: Name, Billing Address, Contact email/phone, any Sage customer code if applicable.
       3. Save. The customer will be available for orders and invoice creation.
    - Notes: When creating an order, select the customer to ensure invoices are issued to the correct client in Sage.

Orders — create and manage (Company Admin)
- Where: `dashboard/(dashboard-displays)/orders/create` and `dashboard/(dashboard-displays)/orders/show`
- Create an order:
   1. Open `orders/create` and choose the Customer and Asset(s) to rent.
   2. Fill order dates, quantity/duration, pricing and any usage notes.
   3. Save/Submit the order. When an order is created the platform will call the `/invoice` API to create an invoice in Sage (if integration is configured) — the order status will update based on the invoice push result.
- Manage orders (state updates):
   1. Use `orders/show` to view order details and current state (e.g., Draft, Confirmed, Invoiced, Completed, Cancelled).
   2. Update order state (confirm, cancel, complete) using the actions on the order detail page.
   3. Retry invoice push from the order detail if the initial push failed.
- Asset usage & history:
   - Orders include asset usage tracking; when an asset is rented its usage and history entries are recorded. Check the asset detail/history view in the dashboard to see usage records and depreciation history.

Notes:
- Orders are pushed to Sage via the `/invoice` API when created; if the invoice push fails the order will remain in a pending state and can be retried after resolving integration issues.
- When updating order state, verify asset usage entries and asset history to ensure correct lifecycle records.

Questions for you (if anything should be more specific)
- Do you want exact full file paths for every page route added to the map (helpful for RAG agents)?
- Should I include example UI labels or screenshots for critical settings (Depreciation Journal Code field, Depreciation Start Date)?

--
Last updated: 2026-02-16

--
Last updated: 2026-02-16


