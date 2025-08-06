class Api::V1::ShelvesController < Api::V1::BaseController
  before_action :authenticate_user!
  load_and_authorize_resource

  # GET /api/v1/shelves
  def index
    @shelves = current_user.shelves
    render json: @shelves
  end

  # POST /api/v1/shelves
  def create
    @shelf = current_user.shelves.build(shelf_params)
    if @shelf.save
      render json: @shelf, status: :created
    else
      render json: { errors: @shelf.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/shelves/:id
  def update
    if @shelf.update(shelf_params)
      render json: @shelf
    else
      render json: { errors: @shelf.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shelves/:id
  def destroy
    @shelf.destroy
    render json: { message: "Shelf deleted successfully" }, status: :ok
  end

  private

  def shelf_params
    params.require(:shelf).permit(:name, :description, :area_id)
  end
end
