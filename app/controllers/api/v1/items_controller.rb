class Api::V1::ItemsController < Api::V1::BaseController
  before_action :set_item, only: [ :show, :update, :destroy ]

  # GET /api/v1/items
  def index
    render_success(data: current_user.items, message: "Items loaded successfully")
  end

  # GET /api/v1/items/:id
  def show
    render_success(data: @item, message: "Item found")
  end

  # POST /api/v1/items
  def create
    @item = current_user.items.new(item_params)

    parent_type = item_params[:parent_type]
    parent_id = item_params[:parent_id]

    if parent_type.present? && parent_id.present?
      parent = resolve_parent(parent_type, parent_id)
      return unless parent
      @item.parent = parent
    end

    if @item.save
      render_success(data: @item, message: "Item created successfully", status: :created)
    else
      render_error(
        message: "Item creation failed",
        errors: @item.errors.full_messages,
        fields: @item.errors.to_hash
      )
    end
  end

  # PATCH /api/v1/items/:id
  def update
    unless @item.editable_by?(current_user)
      return render_forbidden("You are not authorized to edit this item")
    end

    if parent_params_provided?
      parent = resolve_parent(params[:item][:parent_type], params[:item][:parent_id])
      return unless parent
      @item.parent = parent
    end

    if @item.update(container_params)
      render_success(data: @item, message: "Item updated successfully")
    else
      render_error(
        message: "Item update failed",
        errors: @item.errors.full_messages,
        fields: @item.errors.to_hash
      )
    end
  end

  # DELETE /api/v1/items/:id
  def destroy
    unless @item.deletable_by?(current_user)
      return render_forbidden("You are not authorized to delete this item")
    end

    @item.destroy
    render_success(message: "Item deleted successfully", data: nil)
  end

  private

  def set_item
    @item = Item.find_by(id: params[:id])
    render_not_found("Item") unless @item
  end

  def item_params
    params.require(:item).permit(:name, :description, :parent_id, :parent_type)
  end

  def parent_params_provided?
    params.dig(:item, :parent_type).present? && params.dig(:item, :parent_id).present?
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
