# Gadgets — Gadget Store
A fresh responsive gadget ecommerce foundation for PHP 8+ and MySQL.

Included:
- Modern responsive storefront
- Product search, categories and sorting
- Add to cart and checkout
- Customer name, phone, email, home/shipping address and payment method
- Order + order item database
- AI-style product assistant endpoint ready for an LLM provider
- Floating AI and contact-agent buttons
- Auto-scrolling reviews
- About store and social links
- Editable admin panel for products, quick chatbot messages and support agents

Setup:
1. Import database.sql into MySQL.
2. Configure DB_HOST, DB_NAME, DB_USER and DB_PASS or edit api/config.php.
3. Run on PHP 8+ with PDO MySQL enabled.
4. Store: /index.html
5. Admin: /admin/

Production hardening still required before public deployment: admin authentication/authorization, CSRF protection, server-side price validation, rate limiting, real payment gateway webhook verification, and a real LLM provider key kept server-side.