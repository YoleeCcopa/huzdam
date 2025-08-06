class Api::V1::ShelvesController < ApplicationController
  before_action :authenticate_user!
  authorize_resource

  def index
    @shelves = Shelf.accessible_by(current_ability)
    render json: @shelves
  end

  def show
    shelf = Shelf.find(params[:id])
    authorize! :read, shelf
    render json: shelf
  end

  def create
    authorize! :create, Shelf
    shelf = Shelf.new(shelf_params)
    if shelf.save
      render json: shelf, status: :created
    else
      render json: { errors: shelf.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # etc...
end
