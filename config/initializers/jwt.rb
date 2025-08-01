# config/initializers/jwt.rb
JWT_SECRET = Rails.application.credentials.jwt_secret || 'fallback_secret'
