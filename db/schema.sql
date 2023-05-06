### Schema

-- CREATE database kk4zlkdezqtk5us3;
-- USE kk4zlkdezqtk5us3;

USE burger_db;
CREATE TABLE sci_pickups
(
	id int NOT NULL AUTO_INCREMENT,
    crew varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	vessel varchar(255) not null,
	portSelect varchar(255) not null,
	whatsApp varchar(255) not null,
	cell varchar(255) not null,
	pickUp varchar(255) not null,
	dropOff varchar(255) not null,
	numberCrew varchar(255) ,
	dateJa varchar(255) ,
	timeJa varchar(255) ,
	remarks varchar(255) ,
	lastMessageTo varchar(255) ,
	lastMessagefrom varchar(255) ,
	verificationCode varchar(255) ,
	driver varchar(255) ,
	vehicle varchar(255) ,
	vehicle_cell varchar(255) ,
	dispatcher varchar(255) ,
	driverReview varchar(255) ,
	passengerReview varchar(255) ,
	driverScore varchar(255) ,
	passengerScore varchar(255) ,
	pending BOOLEAN DEFAULT 1,
	cancelled BOOLEAN DEFAULT 0,
	completed BOOLEAN DEFAULT 0,
	PRIMARY KEY (id)
);

CREATE TABLE sci_users
(
	id int NOT NULL AUTO_INCREMENT,
	u_first_name varchar(255) NOT NULL,
	u_password varchar(255) NOT NULL,
	u_last_name varchar(255) NOT NULL,
	u_email varchar(255) not null,
	u_whatsApp varchar(255) ,
	u_cell varchar(255) not null,
	u_vessel varchar(255) not null,
	u_role varchar(255) not null,
	PRIMARY KEY (id)
);

 
  