class Area < ApplicationRecord
  belongs_to :user    # owner
  has_many :shelves, dependent: :destroy

  validates :name, presence: true
end