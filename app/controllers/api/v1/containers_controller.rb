class Api::V1::ContainersController < Api::V1::BaseController
  before_action :set_container, only: [:show, :update, :destroy]

  # GET /api/v1/containers
  def index
    render_success(data: current_user.containers, message: "Containers loaded successfully")
  end

  # GET /api/v1/containers/:id
  def show
    render_success(data: @container, message: "Container found")
  end

  # POST /api/v1/containers
  def create
    @container = current_user.containers.new(container_params)

    parent_type = container_params[:parent_type]
    parent_id = container_params[:parent_id]

    if parent_type.present? && parent_id.present?
      parent = resolve_parent(parent_type, parent_id)
      return unless parent
      @container.parent = parent
    end

    if @container.save
      render_success(data: @container, message: "Container created successfully", status: :created)
    else
      render_error(
        message: "Container creation failed",
        errors: @container.errors.full_messages,
        fields: @container.errors.to_hash
      )
    end
  end

  # PATCH /api/v1/containers/:id
  def update
    unless @container.editable_by?(current_user)
      return render_forbidden("You are not authorized to edit this container")
    end

    if parent_params_provided?
      parent = resolve_parent(params[:container][:parent_type], params[:container][:parent_id])
      return unless parent
      @container.parent = parent
    end

    if @container.update(container_params)
      render_success(data: @container, message: "Container updated successfully")
    else
      render_error(
        message: "Container update failed",
        errors: @container.errors.full_messages,
        fields: @container.errors.to_hash
      )
    end
  end

  # DELETE /api/v1/containers/:id
  def destroy
    unless @container.deletable_by?(current_user)
      return render_forbidden("You are not authorized to delete this container")
    end

    @container.destroy
    render_success(message: "Container deleted successfully", data: nil)
  end

  private

  def set_container
    @container = Container.find_by(id: params[:id])
    render_not_found("Container") unless @container
  end

  def container_params
    params.require(:container).permit(:name, :description, :template, :parent_id, :parent_type)
  end

  def parent_params_provided?
    params.dig(:container, :parent_type).present? && params.dig(:container, :parent_id).present?
  end

  def resolve_parent(type, id)
    allowed_types = %w[Container Shelf]
    result = ResolvePolymorphicParent.call(type: type, id: id, allowed_types: allowed_types)

    unless result.success?
      Rails.logger.warn("Parent resolution failed: #{result.error}")
      render_error(message: result.error)
      return nil
    end

    result.parent
  end
end
