import TicketSchema from '../models/ticket.js';

const INSERT_TICKET = async (req, res) => {
  try {
    const ticket = new TicketSchema({
      title: req.body.title,
      ticket_price: req.body.ticket_price,
      from_location: req.body.from_location,
      to_location: req.body.to_location,
      to_location_photo_url: req.body.to_location_photo_url,
    });

    ticket.id = ticket._id;

    const response = await ticket.save();

    return res.status(201).json({ response: response });
  } catch (error) {
    console.error("Error in INSERT_TICKET:", error);
    return res.status(500).json({ error: "An error occurred while inserting the ticket." });
  }
};

  
  export { INSERT_TICKET };