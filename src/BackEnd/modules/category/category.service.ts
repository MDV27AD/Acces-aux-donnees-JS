import { Inject, Injectable } from "@nestjs/common";
import { Pool, RowDataPacket } from "mysql2/promise";
import { MYSQL_CONNECTION } from "../database.module";

@Injectable()
export class CategoryService {
  constructor(@Inject(MYSQL_CONNECTION) private readonly db: Pool) {}

  async findAll() {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
        SELECT name
        FROM category
    `
    );

    return rows.map((r) => r.name);
  }
}
