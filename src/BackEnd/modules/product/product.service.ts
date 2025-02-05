import { Inject, Injectable } from "@nestjs/common";
import { Pool, RowDataPacket } from "mysql2/promise";
import { MYSQL_CONNECTION } from "../database.module";

const SELECT = `
SELECT 
    p.sku,
    p.name, 
    p.serial_number, 
    p.description, 
    p.price, 
    p.status,
    s.name AS supplier,
    c.name AS category
FROM product p
LEFT JOIN category c ON c.id = p.id_category
LEFT JOIN supplier s ON s.id = p.id_supplier
`;

@Injectable()
export class ProductService {
  constructor(@Inject(MYSQL_CONNECTION) private readonly db: Pool) {}

  async findAll(limit: number) {
    const [products] = await this.db.query<RowDataPacket[]>(
      `${SELECT} ${limit > 0 ? "LIMIT " + limit : ""}`
    );

    return products;
  }

  async findOne(id: string) {
    const [products] = await this.db.execute(
      `${SELECT}
            WHERE p.product_id = ?
            GROUP BY p.product_id`,
      [id]
    );

    return products[0];
  }

  async delete(id: number) {
    await this.db.execute(
      `
        DELETE FROM product
        WHERE id = :id
        `,
      {
        id,
      }
    );
  }
}
