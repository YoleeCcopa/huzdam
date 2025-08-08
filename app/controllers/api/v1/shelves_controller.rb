class Api::V1::ShelvesController < Api::V1::BaseController
  before_action :set_area, only: [:create]
  # load_and_authorize_resource

  # GET /api/v1/shelves
  def index
    @shelves = current_user.shelves
    render json: @shelves
  end

  # POST /api/v1/shelves
  def create
    @shelf = Shelf.new(shelf_params)
    @shelf.user = current_user
    @shelf.parent = @area  # Set parent as Area

    if @shelf.save
      render json: @shelf, status: :created
    else
      render json: @shelf.errors, status: :unprocessable_entity
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

  def set_area
    @area = Area.find(params[:area_id])
  end

  def shelf_params
    params.require(:shelf).permit(:name, :description)
  end
end
