class Item < ApplicationRecord
  belongs_to :user
  belongs_to :parent, polymorphic: true, optional: true

  validates :name, :description, presence: true
  validates :custom_label, length: { maximum: 255 }, allow_blank: true
end
