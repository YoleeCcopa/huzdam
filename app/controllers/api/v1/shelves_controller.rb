class Api::V1::ShelvesController < Api::V1::BaseController
  before_action :set_shelf, only: [:show, :update, :destroy]

  # GET /api/v1/shelves
  def index
    render json: current_user.shelves
  end

  # GET /api/v1/shelves/:id
  def show
    render json: @shelf
  end

  # POST /api/v1/shelves
  def create
    @shelf = current_user.shelves.new(shelf_params)

    # Resolve polymorphic parent
    parent_type = shelf_params[:parent_type]
    parent_id = shelf_params[:parent_id]

    if parent_type.present? && parent_id.present?
      parent = resolve_parent(parent_type, parent_id)
      return unless parent
      @shelf.parent = parent
    end

    Rails.logger.debug("Attempting to save shelf: #{@shelf.attributes}")

    if @shelf.save
      render json: @shelf, status: :created
    else
      Rails.logger.warn("Shelf creation failed: #{@shelf.errors.full_messages}")
      render json: {
        message: "Shelf creation failed.",
        errors: @shelf.errors.full_messages,
        fields: @shelf.errors.to_hash
      }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/shelves/:id
  def update
    unless @shelf.editable_by?(current_user)
      render json: { error: "You are not authorized to edit this shelf" }, status: :forbidden and return
    end

    if parent_params_provided?
      parent = resolve_parent(params[:shelf][:parent_type], params[:shelf][:parent_id])
      return unless parent
      @shelf.parent = parent
    end

    if @shelf.update(shelf_params)
      render json: @shelf, status: :ok
    else
      render json: { errors: @shelf.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shelves/:id
  def destroy
    unless @shelf.deletable_by?(current_user)
      render json: { error: "You are not authorized to delete this shelf" }, status: :forbidden and return
    end

    @shelf.destroy
    head :no_content
  end

  private

  def set_shelf
    @shelf = Shelf.find_by(id: params[:id])
    render json: { error: "Shelf not found" }, status: :not_found unless @shelf
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
      render json: { error: result.error }, status: :unprocessable_entity
      return nil
    end

    Rails.logger.debug("Resolved parent: #{result.parent.class.name}##{result.parent.id}")
    result.parent
  end
end
