class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  # Skip CSRF for JSON requests (typical for APIs using token auth)
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
end
