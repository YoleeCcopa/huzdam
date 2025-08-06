class Area < ApplicationRecord
  belongs_to :user
  has_many :shelves, dependent: :destroy

  validates :name, :description, presence: true
end