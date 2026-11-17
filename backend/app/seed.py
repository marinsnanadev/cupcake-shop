import sys
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal, engine, Base
from app.models import Category, Product

Base.metadata.create_all(bind=engine)

categories_data = [
    {
        "name": "Clássicos",
        "description": "Sabores queridos para qualquer ocasião.",
        "accent": "Favoritos da casa",
        "image": "classicos-banner.jpg",
        "products": [
            {"id": "chocolate", "name": "Cupcake de Chocolate", "tag": "Clássico", "price": 10,
             "blurb": "Massa fofinha de chocolate com cobertura cremosa.", "image": "chocolate.jpg",
             "is_new": False, "is_featured": True},
            {"id": "baunilha", "name": "Cupcake de Baunilha", "tag": "Clássico", "price": 8,
             "blurb": "Baunilha suave com uma delicada cobertura amanteigada.", "image": "baunilha.jpg",
             "is_new": False, "is_featured": False},
            {"id": "morango", "name": "Cupcake de Morango", "tag": "Favorito", "price": 11,
             "blurb": "Massa leve com cobertura feita com morangos.", "image": "morango.jpg",
             "is_new": True, "is_featured": True},
        ],
    },
    {
        "name": "Especiais",
        "description": "Combinações especiais feitas para surpreender.",
        "accent": "Receitas especiais",
        "image": "especiais-banner.jpg",
        "products": [
            {"id": "red-velvet", "name": "Red Velvet", "tag": "Especial", "price": 14,
             "blurb": "Massa aveludada com cobertura cremosa de cream cheese.", "image": "red-velvet.jpg",
             "is_new": True, "is_featured": True},
            {"id": "limao", "name": "Cupcake de Limão", "tag": "Especial", "price": 12,
             "blurb": "Toque cítrico de limão com cobertura leve.", "image": "limao.jpg",
             "is_new": False, "is_featured": False},
            {"id": "doce-de-leite", "name": "Cupcake de Doce de Leite", "tag": "Especial", "price": 15,
             "blurb": "Massa macia recheada e coberta com doce de leite.", "image": "doce-de-leite.jpg",
             "is_new": True, "is_featured": True},
        ],
    },
]


def seed():
    db = SessionLocal()

    db.query(Product).delete()
    db.query(Category).delete()
    db.commit()

    for cat_data in categories_data:
        products_data = cat_data.pop("products")
        category = Category(**cat_data)
        db.add(category)
        db.flush()

        for p_data in products_data:
            product = Product(**p_data, category_id=category.id)
            db.add(product)

    db.commit()
    db.close()
    print("Banco populado com sucesso!")


if __name__ == "__main__":
    seed()
