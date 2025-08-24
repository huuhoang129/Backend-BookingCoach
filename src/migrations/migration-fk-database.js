"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // chạy trong transaction để rollback nếu lỗi
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addConstraint(
        "Comments", // tên table child
        {
          fields: ["userId"],
          type: "foreign key",
          name: "fk_comments_userId", // đặt tên rõ ràng
          references: {
            table: "Users",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "ImageVehicles", // tên table child
        {
          fields: ["vehicleId"],
          type: "foreign key",
          name: "fk_imageVehicle_vehicleId", // đặt tên rõ ràng
          references: {
            table: "Vehicles",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "PointTickets", // tên table child
        {
          fields: ["timepointId"],
          type: "foreign key",
          name: "fk_pointTickets_timepointId", // đặt tên rõ ràng
          references: {
            table: "Timepoints",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "PointTickets", // tên table child
        {
          fields: ["ticketId"],
          type: "foreign key",
          name: "fk_pointTickets_ticketId", // đặt tên rõ ràng
          references: {
            table: "Tickets",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "Points", // tên table child
        {
          fields: ["stationId"],
          type: "foreign key",
          name: "fk_points_stationId", // đặt tên rõ ràng
          references: {
            table: "Stations",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "Rates", // tên table child
        {
          fields: ["userId"],
          type: "foreign key",
          name: "fk_rates_userId", // đặt tên rõ ràng
          references: {
            table: "Users",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "SeatTickets", // tên table child
        {
          fields: ["ticketId"],
          type: "foreign key",
          name: "fk_seatTickets_ticketId", // đặt tên rõ ràng
          references: {
            table: "Tickets",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "SeatTickets", // tên table child
        {
          fields: ["seatId"],
          type: "foreign key",
          name: "fk_seatTickets_seatId", // đặt tên rõ ràng
          references: {
            table: "Seats",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "Seats", // tên table child
        {
          fields: ["vehicleId"],
          type: "foreign key",
          name: "fk_seats_vehicleId", // đặt tên rõ ràng
          references: {
            table: "Vehicles",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "Tickets", // tên table child
        {
          fields: ["userId"],
          type: "foreign key",
          name: "fk_tickets_userId", // đặt tên rõ ràng
          references: {
            table: "Users",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "Tickets", // tên table child
        {
          fields: ["tripPassengerId"],
          type: "foreign key",
          name: "fk_tickets_tripPassengerId", // đặt tên rõ ràng
          references: {
            table: "TripPassengers",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "TimePoints", // tên table child
        {
          fields: ["pointId"],
          type: "foreign key",
          name: "fk_timepoints_pointId", // đặt tên rõ ràng
          references: {
            table: "Points",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "TimePoints", // tên table child
        {
          fields: ["tripPassengerId"],
          type: "foreign key",
          name: "fk_timepoints_tripPassengerId", // đặt tên rõ ràng
          references: {
            table: "TripPassengers",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );

      await queryInterface.addConstraint(
        "TripPassengers", // tên table child
        {
          fields: ["tripId"],
          type: "foreign key",
          name: "fk_trippassengers_tripId", // đặt tên rõ ràng
          references: {
            table: "Trips",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "TripPassengers", // tên table child
        {
          fields: ["passengerId"],
          type: "foreign key",
          name: "fk_trippassengers_passengerId", // đặt tên rõ ràng
          references: {
            table: "PassengerCarCompanies",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "TripPassengers", // tên table child
        {
          fields: ["vehicleId"],
          type: "foreign key",
          name: "fk_trippassengers_vehicleId", // đặt tên rõ ràng
          references: {
            table: "Vehicles",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );

      await queryInterface.addConstraint(
        "Trips", // tên table child
        {
          fields: ["fromStation"],
          type: "foreign key",
          name: "fk_trips_fromStation", // đặt tên rõ ràng
          references: {
            table: "Stations",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
      await queryInterface.addConstraint(
        "Trips", // tên table child
        {
          fields: ["toStation"],
          type: "foreign key",
          name: "fk_tris_toStation", // đặt tên rõ ràng
          references: {
            table: "Stations",
            field: "id",
          },
          onDelete: "CASCADE", // theo yêu cầu của bạn
          onUpdate: "CASCADE",
          transaction,
        }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint("Comments", "fk_comments_userId", {
        transaction,
      });
      await queryInterface.removeConstraint(
        "ImageVehicles",
        "fk_imageVehicle_vehicleId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "PointTickets",
        "fk_pointTickets_timepointId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "PointTickets",
        "fk_pointTickets_ticketId",
        { transaction }
      );
      await queryInterface.removeConstraint("Points", "fk_points_stationId", {
        transaction,
      });
      await queryInterface.removeConstraint("Rates", "fk_rates_userId", {
        transaction,
      });
      await queryInterface.removeConstraint(
        "SeatTickets",
        "fk_seatTickets_ticketId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "SeatTickets",
        "fk_seatTickets_seatId",
        { transaction }
      );
      await queryInterface.removeConstraint("Seats", "fk_seats_vehicleId", {
        transaction,
      });
      await queryInterface.removeConstraint("Tickets", "fk_tickets_userId", {
        transaction,
      });
      await queryInterface.removeConstraint(
        "Tickets",
        "fk_tickets_tripPassengerId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "TimePoints",
        "fk_timepoints_pointId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "TimePoints",
        "fk_timepoints_tripPassengerId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "TimePoints",
        "fk_trippassengers_tripId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "TimePoints",
        "fk_trippassengers_passengerId",
        { transaction }
      );
      await queryInterface.removeConstraint(
        "TimePoints",
        "fk_trippassengers_vehicleId",
        { transaction }
      );
      await queryInterface.removeConstraint("Trips", "fk_trips_fromStation", {
        transaction,
      });
      await queryInterface.removeConstraint("Trips", "fk_tris_toStation", {
        transaction,
      });
    });
  },
};
