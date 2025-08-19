class Api::V1::BaseController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken  # Ensures the user is authenticated by the token
  include ApiResponse

  before_action :authenticate_api_v1_user!

  # Alias current_user to refer to current_api_v1_user
  def current_user
    current_api_v1_user
  end
end
