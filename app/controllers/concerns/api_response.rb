module ApiResponse
  extend ActiveSupport::Concern

  def render_success(data: {}, message: nil, meta: {}, status: :ok)
    render json: {
      success: true,
      status: Rack::Utils.status_code(status),
      message: message,
      data: data,
      meta: meta.presence
    }.compact, status: status
  end

  def render_error(message: "An error occurred", errors: [], fields: {}, code: nil, codes: [], status: :unprocessable_entity)
    codes = codes.presence || error_codes_from(fields)

    render json: {
      success: false,
      status: Rack::Utils.status_code(status),
      message: message,
      code: code.presence || codes.first,
      codes: codes.presence,
      errors: Array(errors),
      fields: fields.presence
    }.compact, status: status
  end

  def render_not_found(resource = "Resource", code: "not_found")
    render_error(message: "#{resource} not found", code: code, status: :not_found)
  end

  def render_forbidden(message = "You are not authorized to perform this action", code: "forbidden")
    render_error(message: message, code: code, status: :forbidden)
  end

  private

  # Generate error codes from ActiveModel::Errors # i18n
  def error_codes_from(fields)
    return [] unless fields.is_a?(Hash)

    fields.flat_map do |attribute, messages|
      Array(messages).map do |msg|
        normalize_error_code(attribute, msg)
      end
    end.uniq
  end

  # Normalize attribute + message into a snake_case code like :email_taken
  def normalize_error_code(attribute, message)
    key = "#{attribute}_#{message}".downcase
    key.gsub(/[^a-z0-9]+/, "_").gsub(/_+$/, "").to_sym
  end
end
