# TODOS

## finish invoice creation form

- invoice number field on creation --> remove "first invoice" modal and use invoice number directly on form.
  if inserted invoice number already exists, alert user that it might cause conflicts.
- remove "services" select-multiple and override with button. on click, add to array-like field on form a service (select input for service id) and quantity (number input)
- include "due date"

## add search/filter to invoice list

## add a lot of animations

- invoice cards
- service+quantity forms on invoice new

## invoice "templates" / fast create

- create button should be dropdown or add new dropdown button for "templates" (maybe use a modal with select?)
- add field to "also make this a template" (with description "you can use it later...")

## zero state view

- tables
- invoice list

## soft and hard delete for invoices

## add client currency

- add client currency field so it can be displayed correctly on the invoice,
  also add field for "en-US" "pt-BR" etc on the currencies declaration (with prefix suffix etc)

## user account page

## improve data table (specially columns)

- multi-row actions
- filter
- inline action buttons ?

## extract "address" table ?

## new invoice layouts

- create other options for invoice layouts with react-pdf

## better formatting for currencies

- it's being done in multiple places differently

---

## FIGURE OUT

- how to handle invoices with services with diferent currencies (e.g. service 1 BRL & service 2 USD - how to show the total? disable this behaviour on invoice creation?)

---

## QoL

- if on invoice list and has no services/clients, show "please add .... before creating invoice"
- if user is creating invoice with a invoice date on the past, prompt "import invoices"
- react-tour / react-joyride ??

---

## others

- on sign-up/login page, add "we use workOs to protect your auth data"
- audit components (some are using shadcn definition still)

---
