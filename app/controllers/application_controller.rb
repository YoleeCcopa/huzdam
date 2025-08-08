class ApplicationController < ActionController::Base
  include CanCan::ControllerAdditions

  rescue_from CanCan::AccessDenied do |exception|
    render json: { error: "Access denied: #{exception.message}" }, status: :forbidden
  end

  protect_from_forgery with: :exception

  # Skip CSRF for JSON requests (typical for APIs using token auth)
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
end
