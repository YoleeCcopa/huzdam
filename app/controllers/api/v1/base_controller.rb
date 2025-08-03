class Api::V1::BaseController < ActionController::API
  # Optional: You can also use ActionController::Base if you need more middleware
  skip_before_action :verify_authenticity_token
end