module ApiResponse
  extend ActiveSupport::Concern

  def render_success(data: {}, message: nil, status: :ok)
    render json: {
      success: true,
      message: message,
      data: data
    }, status: status
  end

  def render_error(message: "An error occurred", errors: [], fields: {}, status: :unprocessable_entity)
    render json: {
      success: false,
      message: message,
      errors: Array(errors),
      fields: fields
    }, status: status
  end

  def render_not_found(resource = "Resource")
    render_error(message: "#{resource} not found", status: :not_found)
  end

  def render_forbidden(message = "You are not authorized to perform this action")
    render_error(message: message, status: :forbidden)
  end
end
