1. Run `rails db:migrate` to create tables
2. Run `rails db:seed` to populate sample data
3. Run `rails s` to start the server
4. Open http://localhost:3000/api/login to test login endpoint

Requirements:
- Users can create accounts (signup)
- Users can login with email/password
- Password storage uses bcrypt
- Passwords require minimum strength
- Email is stored lowercase
- API responses include auth tokens