import { Inject, Injectable } from "@nestjs/common";
import { Pool, RowDataPacket } from "mysql2/promise";
import { MYSQL_CONNECTION } from "src/modules/database.module";

@Injectable()
export class DistributorService {
  constructor(@Inject(MYSQL_CONNECTION) private readonly db: Pool) {}

  async findOne(id: string) {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      `
            SELECT *
            FROM distributor
            WHERE id = :id
        `,
      { id }
    );
    const data = rows[0];

    return {
      id: data.id,
      name: data.name,
    };
  }
}
