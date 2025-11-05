# TODOS!!
  
## Invoice Creation Form

- [ ] Invoice number field on creation
  - Remove "first invoice" modal and use invoice number directly on form
  - If inserted invoice number already exists, alert user that it might cause conflicts
- [ ] Remove "services" select-multiple and override with button
  - On click, add to array-like field on form:
    - Service (select input for service id)
    - Quantity (number input)
- [ ] Include "due date" field

## Invoice List

- [ ] Add search/filter functionality
- [ ] Add zero state view for empty invoice list
- [ ] Soft and hard delete for invoices
- [ ] If on invoice list and has no services/clients, show "please add .... before creating invoice"
- [ ] If user is creating invoice with an invoice date on the past, prompt "import invoices"

## Animations

- [ ] Invoice cards animations
- [ ] Service+quantity forms on invoice new page

## Invoice Templates / Fast Create

- [ ] Create button should be dropdown or add new dropdown button for "templates" (maybe use a modal with select?)
- [ ] Add field to "also make this a template" (with description "you can use it later...")

## Zero State Views

- [ ] Tables
- [ ] Invoice list

## Client Currency

- [ ] Add client currency field so it can be displayed correctly on the invoice
- [ ] Add field for "en-US" "pt-BR" etc on the currencies declaration (with prefix suffix etc)

## User Account Page

- [ ] Implement user account page

## Data Table Improvements

- [ ] Multi-row actions
- [ ] Filter functionality
- [ ] Inline action buttons

## Database Structure

- [ ] Extract "address" table (consider if needed)

## Invoice Layouts

- [ ] Create other options for invoice layouts with react-pdf

## Currency Formatting

- [ ] Better formatting for currencies
  - Currently being done in multiple places differently
  - Need to standardize approach

## Architecture & Components

- [ ] Audit components (some are using shadcn definition still)

## User Experience Enhancements

- [ ] On sign-up/login page, add "we use workOs to protect your auth data"
- [ ] React-tour / react-joyride (consider adding onboarding)

## Questions to Resolve

- [ ] How to handle invoices with services with different currencies
  - Example: service 1 BRL & service 2 USD - how to show the total?
  - Should we disable this behaviour on invoice creation?
