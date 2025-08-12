class Api::V1::ShelvesController < Api::V1::BaseController
  before_action only: [ :show, :update, :destroy ]
  # load_and_authorize_resource

  # GET /api/v1/shelves
  def index
    Rails.logger.debug("Current User: #{current_user.inspect}")
    @shelves = current_user.shelves
    render json: @shelves
  end

  # GET /api/v1/shelves/:id
  def show
    Rails.logger.debug("Current User: #{current_user.inspect}")
    render json: @shelves
  end

  # POST /api/v1/shelves
  def create
    @shelf = Shelf.new(shelf_params)
    @shelf.user = current_user
    @shelf.parent = parent  # Sets both parent_id and parent_type

      Rails.logger.debug("Current parent: #{parent}")
    if @shelf.save
      render json: @shelf, status: :created
    else
      Rails.logger.debug("Shelf save failed: #{@shelf.errors.full_messages}")
      render json: @shelf.errors.full_messages, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/shelves/:id
  def update
    unless @shelf.editable_by?(current_user)
      render json: { error: "You are not authorized to edit this shelf" }, status: :forbidden
      return
    end

    # If the parent area is being updated, set the parent id and type
    @shelf.parent = @area
    @shelf.parent_id = @area.id
    @shelf.parent_type = "Area"  # Ensure parent_type is correctly set

    if @shelf.update(shelf_params)
      render json: @shelf, status: :ok
    else
      render json: @shelf.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shelves/:id
  def destroy
    unless @shelf.deletable_by?(current_user)
      render json: { error: "You are not authorized to delete this shelf" }, status: :forbidden
      return
    end

    @shelf.destroy
    head :no_content
  end

  private

  def parent
    allowed_types = %w[Area Room]  # <- add your real parentable models here
    type = params[:shelf][:parent_type]

    unless allowed_types.include?(type)
      render json: { error: "Invalid parent type" }, status: :unprocessable_entity and return
    end

    type.constantize.find(params[:shelf][:parent_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Parent not found" }, status: :not_found
  end

  def shelf_params
    params.require(:shelf).permit(:name, :description, :template, :parent_id, :parent_type)
  end
end
