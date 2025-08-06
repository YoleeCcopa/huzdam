class Container < ApplicationRecord
  belongs_to :user
  belongs_to :parent, polymorphic: true, optional: true

  has_many :containers, as: :parent, dependent: :destroy
  has_many :items, as: :parent, dependent: :destroy

  validates :name, :description, presence: true

  # Recursive descendants (containers)
  def self.recursive_descendants(root_container)
    recursive_sql = <<~SQL
      WITH RECURSIVE container_tree AS (
        SELECT * FROM containers WHERE id = #{root_container.id}
        UNION ALL
        SELECT c.* FROM containers c
        INNER JOIN container_tree ct ON c.parent_type = 'Container' AND c.parent_id = ct.id
      )
      SELECT * FROM container_tree WHERE id != #{root_container.id}
    SQL

    Container.find_by_sql(recursive_sql)
  end

  # All containers nested inside this container (recursive)
  def all_containers
    self.class.recursive_descendants(self)
  end

  # All items inside this container or any nested containers
  def all_items
    Item.where(parent: self)
        .or(Item.where(parent: all_containers))
  end
end
