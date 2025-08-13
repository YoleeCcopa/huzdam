class Api::V1::ShelvesController < Api::V1::BaseController
  before_action :set_shelf, only: [:show, :update, :destroy]

  # GET /api/v1/shelves
  def index
    render_success(data: current_user.shelves, message: "Shelves loaded successfully")
  end

  # GET /api/v1/shelves/:id
  def show
    render_success(data: @shelf, message: "Shelf found")
  end

  # POST /api/v1/shelves
  def create
    @shelf = current_user.shelves.new(shelf_params)

    parent_type = shelf_params[:parent_type]
    parent_id = shelf_params[:parent_id]

    if parent_type.present? && parent_id.present?
      parent = resolve_parent(parent_type, parent_id)
      return unless parent
      @shelf.parent = parent
    end

    if @shelf.save
      render_success(data: @shelf, message: "Shelf created successfully", status: :created)
    else
      render_error(
        message: "Shelf creation failed",
        errors: @shelf.errors.full_messages,
        fields: @shelf.errors.to_hash
      )
    end
  end

  # PATCH /api/v1/shelves/:id
  def update
    unless @shelf.editable_by?(current_user)
      return render_forbidden("You are not authorized to edit this shelf")
    end

    if parent_params_provided?
      parent = resolve_parent(params[:shelf][:parent_type], params[:shelf][:parent_id])
      return unless parent
      @shelf.parent = parent
    end

    if @shelf.update(shelf_params)
      render_success(data: @shelf, message: "Shelf updated successfully")
    else
      render_error(
        message: "Shelf update failed",
        errors: @shelf.errors.full_messages,
        fields: @shelf.errors.to_hash
      )
    end
  end

  # DELETE /api/v1/shelves/:id
  def destroy
    unless @shelf.deletable_by?(current_user)
      return render_forbidden("You are not authorized to delete this shelf")
    end

    @shelf.destroy
    render_success(message: "Shelf deleted successfully", data: nil)
  end

  private

  def set_shelf
    @shelf = Shelf.find_by(id: params[:id])
    render_not_found("Shelf") unless @shelf
  end

  def shelf_params
    params.require(:shelf).permit(:name, :description, :template, :parent_id, :parent_type)
  end

  def parent_params_provided?
    params.dig(:shelf, :parent_type).present? && params.dig(:shelf, :parent_id).present?
  end

  def resolve_parent(type, id)
    allowed_types = %w[Area]
    result = ResolvePolymorphicParent.call(type: type, id: id, allowed_types: allowed_types)

    unless result.success?
      Rails.logger.warn("Parent resolution failed: #{result.error}")
      render_error(message: result.error)
      return nil
    end

    result.parent
  end
end
