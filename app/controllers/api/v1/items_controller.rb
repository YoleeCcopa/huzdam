class Api::V1::ItemsController < Api::V1::BaseController
  before_action :authenticate_user!
  load_and_authorize_resource

  # GET /api/v1/items
  def index
    @items = current_user.items
    render json: @items
  end

  # POST /api/v1/items
  def create
    @item = current_user.items.build(item_params)
    if @item.save
      render json: @item, status: :created
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/items/:id
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/items/:id
  def destroy
    @item.destroy
    render json: { message: "Item deleted successfully" }, status: :ok
  end

  private

  def item_params
    params.require(:item).permit(:name, :description, :parent_type, :parent_id)
  end
end
