class DeniedAccess < ApplicationRecord
  belongs_to :user
  belongs_to :object, polymorphic: true

  validates :hidden, inclusion: { in: [ true, false ] } # Ensures only true or false
end
