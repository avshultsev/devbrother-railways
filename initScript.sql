--add stops
CREATE TABLE Trains (
  trainNumber         int PRIMARY KEY,
  carriageNumber      int,
  frequency           varchar(10), -- can it bee a specific value like ('daily' || 'odd' || 'even' || specific weekdays) ?
  departurePoint      int, -- Station code
  arrivalPoint        int, -- Station code
  departureTime       date,
  arrivalTime         date,
  lead                varchar(30), -- id of the Employee document for lead, machenist, machenist assistant
  machenist           varchar(30),
  machenistAssistant  varchar(30)
);

CREATE TABLE Carriages (
  trainNumber     int,
  carriageNumber  int,
  seat            int,
  carriageType    varchar(20),
  conductor1      varchar(30), -- id of the Employee document
  conductor2      varchar(30), -- id of the Employee document
  PRIMARY KEY (trainNumber, carriageNumber)
);

CREATE TABLE Seats (
  trainNumber     int,
  carriageNumber  int,
  seatNumber      int,
  isBooked        boolean DEFAULT false,
  passenger       varchar(30), -- id of the Employee document, can be NULL
  ticket          int DEFAULT NULL, -- id of the Ticket, can be NULL if not sold; if (ticket && isBooked) => ticket is sold
  PRIMARY KEY (trainNumber, carriageNumber, seatNumber)
);

CREATE TABLE Tickets (
  ticketID        int PRIMARY KEY,
  trainNumber     int,
  carriageNumber  int,
  seat            int,
  passenger       varchar(30), -- id of the Employee document, can be NULL
  departurePoint  int, -- Station code
  arrivalPoint    int, -- Station code
  departureTime   date,
  arrivalTime     date
);

CREATE TABLE Stations (
  stationCode  int PRIMARY KEY,
  title        varchar(20)
);

CREATE TABLE Employees (
  passportID   varchar(8) PRIMARY KEY, -- f.ex. 'AA123456'; it's the id of the Employee document
  name         varchar(20),
  surname      varchar(30),
  fathersName  varchar(40),
  birthDate    date,
  address      varchar(100),
  phone        varchar(10), -- f.ex. '0951234567'
  occupation   varchar(10) DEFAULT NULL -- probably here role must be given; if NULL - ordinary passenger
);