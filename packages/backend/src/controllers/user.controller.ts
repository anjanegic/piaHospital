import express from "express";
import User from "../models/user";

export class UserController {
  login = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({ username: username, password: password }, (err, user) => {
      if (err) console.log(err);
      else {
        return res.json(user);
      }
    });
  };

  register = (req: express.Request, res: express.Response) => {
    let user = new User({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      type: "patient",
      approved: false,
      deleted: false,
      profile_picture: req.body.profile_picture,
      appointments: [],
      bookedAppointments: [],
    });

    user.save((err, resp) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "error" });
      } else res.json({ message: "ok" });
    });
  };

  registerDoctor = (req: express.Request, res: express.Response) => {
    let user = new User({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      type: "doctor",
      approved: true,
      deleted: false,
      profile_picture: req.body.profile_picture,
      appointments: req.body.appointments,
      specialization: req.body.specialization,
      branch: req.body.branch,
      license: req.body.license,
      bookedAppointments: [],
    });

    user.save((err, resp) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "error" });
      } else res.json({ message: "ok" });
    });
  };

  checkExistingUser = (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const email = req.body.email;

    User.findOne(
      { $or: [{ username: username }, { email: email }] },
      (err, user) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "error" });
        } else if (user) {
          res.json({ message: "exists" });
        } else {
          res.json({ message: "ok" });
        }
      }
    );
  };

  saveCheckedAppointments = (req: express.Request, res: express.Response) => {
    let savedApp = req.body.appointments;
    let username = req.body.user;
    User.updateOne(
      { username: username },
      { $set: { appointments: savedApp } },
      (err, resp) => {
        if (err) console.log(err);
        else res.json({ message: "ok" });
      }
    );
  };

  getAllDoctors = (req: express.Request, res: express.Response) => {
    User.find({ type: "doctor", deleted: false }, (err, user) => {
      if (err) console.log(err);
      else res.json(user);
    });
  };

  changePassword = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let password = req.body.password;
    let newPassword = req.body.newPassword;

    User.findOne({ username: username, password: password }, (err, user) => {
      if (err) console.log(err);
      if (!user) {
        return res.json({ message: "error" });
      } else {
        User.updateOne(
          { username: username },
          { $set: { password: newPassword } },
          (err, resp) => {
            if (err) console.log(err);
            else res.json({ message: "ok" });
          }
        );
      }
    });
  };

  getLoggedInUser = (req: express.Request, res: express.Response) => {
    let username = req.body.username;

    User.findOne({ username: username }, (err, user) => {
      if (err) console.log(err);
      else {
        return res.json(user);
      }
    });
  };

  updateUserProfile = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let fields = req.body.updatedProfile;
    let passed = 0;

    User.findOne({ username: username }, (err, user) => {
      if (err) console.log(err);
      else {
        for (const [key, value] of Object.entries(fields)) {
          const f = {};
          f[key] = value;
          User.updateOne({ username: username }, { $set: f }, (err, resp) => {
            if (err) {
              console.log(err);
            } else {
              passed = 1;
            }
          });
        }
        res.json({ message: "ok" });
      }
    });
  };

  findAppointment = (req: express.Request, res: express.Response) => {
    let u = req.body.doctor;
    let date = req.body.date;

    User.findOne({ username: u }, (err, user) => {
      if (err) console.log(err);
      else if (!user) {
        return res.json({ message: "error" });
      } else {
        if (user.bookedAppointments.length > 0) {
          for (let b of user.bookedAppointments) {
            const firstDate = new Date(b.date);
            const secondDate = new Date(date);
            if (firstDate.getTime() == secondDate.getTime())
              return res.json({ message: "error" });
          }
        }
        return res.json({ message: "free" });
      }
    });
  };

  bookAppointment = (req: express.Request, res: express.Response) => {
    const { doctor, patient, date, appointment } = req.body;
    let message = "Success";
    User.findOne({ username: doctor }, (err, user) => {
      let appointmentFromUser = {};
      if (err) {
        return res.json({ message: "error" });
      } else {
        for (const a of user.appointments) {
          if (a.name === appointment) {
            appointmentFromUser = a;
            break;
          }
        }
      }
      User.findOne({ username: patient }, (err, user2) => {
        let bookedAppointment = {
          doctor: user,
          patient: user2,
          date: date,
          appointment: appointmentFromUser,
          report: false,
        };
        User.findOneAndUpdate(
          { username: doctor },
          { $push: { bookedAppointments: bookedAppointment } },
          (err, success) => {
            if (err) {
              return res.json({ message: "error" });
            }
          }
        );
        User.findOneAndUpdate(
          { username: patient },
          { $push: { bookedAppointments: bookedAppointment } },
          (err, success) => {
            if (err) {
              console.log(err);
              return res.json({ message: "error" });
            }
          }
        );
      });
    });
    return res.json({ message });
  };

  getBookedAppointments = (req: express.Request, res: express.Response) => {
    let user = req.body.user;
    User.findOne({ username: user }, (err, u) => {
      let bookedAppointments = [];
      if (err) console.log(err);
      else if (!u) {
        return res.json({ message: "error" });
      } else {
        if (u.bookedAppointments.length > 0) {
          for (let b of u.bookedAppointments) {
            const firstDate = new Date(b.date);
            const secondDate = new Date();
            if (firstDate.getTime() > secondDate.getTime())
              bookedAppointments.push(b);
          }
          return res.json({ message: bookedAppointments });
        }
      }
    });
  };

  getChosenAppointments = (req: express.Request, res: express.Response) => {
    let user = req.body.user;
    console.log(user);

    User.findOne({ username: user }, (err, userD) => {
      if (err) console.log(err);
      else {
        let chosenApp = [];
        for (let i of userD.appointments) {
          if (i.chosen) {
            chosenApp.push(i);
          }
        }
        res.json(chosenApp);
      }
    });
  };

  deleteAppointment = (req: express.Request, res: express.Response) => {
    let app = req.body.app;
    let username = req.body.username;

    User.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        User.findOne({ username: app.doctor.username }, (err, doctor) => {
          if (err) {
            return res.json({ message: "error" });
          }

          user.bookedAppointments = user.bookedAppointments.filter(
            (d) => new Date(d.date).getTime() !== new Date(app.date).getTime()
          );

          User.findOneAndUpdate(
            { username: username },
            { $set: { bookedAppointments: user.bookedAppointments } },
            (err, resp) => {
              if (err) {
                console.log(err);
              }
            }
          );

          doctor.bookedAppointments = doctor.bookedAppointments.filter(
            (d) => new Date(d.date).getTime() !== new Date(app.date).getTime()
          );

          User.findOneAndUpdate(
            { username: doctor.username },
            { $set: { bookedAppointments: doctor.bookedAppointments } },
            (err, resp) => {
              if (err) {
                console.log(err);
              }
            }
          );
          return res.json({ message: user.bookedAppointments });
        });
      }
    });
  };

  createAppointment = (req: express.Request, res: express.Response) => {
    let user = req.body.user;
    let appointment = req.body.appointment;

    User.findOneAndUpdate(
      { username: user.username },
      { $push: { appointments: appointment } },
      (err, success) => {
        if (err) {
          return res.json({ message: "error" });
        } else {
          return res.json({ message: "success" });
        }
      }
    );
  };

  createAppointmentManager = (req: express.Request, res: express.Response) => {
    let specialization = req.body.specialization;
    let appointment = req.body.appointment;

    User.find({ specialization: specialization }, (err, users) => {
      if (err) console.log(err);
      else {
        for (let user of users) {

          User.findOneAndUpdate(
            { username: user.username },
            { $push: { appointments: appointment } },
            (err, user) => {
              if (err) {
                return res.json({ message: "error" });
              } else {
              }
            }
          );
        }
      }
      return res.json({ message: "success" });
    });
  };

  getPastBookedAppointments = (req: express.Request, res: express.Response) => {
    let patient = req.body.patient;
    let doctor = req.body.doctor;
    User.findOne({ username: patient }, (err, u) => {
      let bookedAppointments = [];
      if (err) console.log(err);
      else if (!u) {
        return res.json({ message: "error" });
      } else {
        if (u.bookedAppointments.length > 0) {
          for (let b of u.bookedAppointments) {
            const firstDate = new Date(b.date);
            const secondDate = new Date();
            if (
              firstDate.getTime() <= secondDate.getTime() &&
              b.doctor.username === doctor &&
              b.report === false
            )
              bookedAppointments.push(b);
          }
          return res.json(bookedAppointments);
        }
      }
    });
  };

  getAllPatients = (req: express.Request, res: express.Response) => {
    User.find(
      { type: "patient", approved: true, deleted: false },
      (err, user) => {
        if (err) console.log(err);
        else res.json(user);
      }
    );
  };

  getAllPatientsWaiting = (req: express.Request, res: express.Response) => {
    User.find(
      { type: "patient", approved: false, deleted: false },
      (err, user) => {
        if (err) console.log(err);
        else res.json(user);
      }
    );
  };

  deleteUser = (req: express.Request, res: express.Response) => {
    let username = req.body.username;

    User.updateOne(
      { username: username },
      { $set: { approved: false, deleted: true } },
      (err, resp) => {
        if (err) console.log(err);
        else res.json({ message: "ok" });
      }
    );
  };

  approveUser = (req: express.Request, res: express.Response) => {
    let username = req.body.username;

    User.updateOne(
      { username: username },
      { $set: { approved: true } },
      (err, resp) => {
        if (err) console.log(err);
        else res.json({ message: "ok" });
      }
    );
  };

  approveAppointment = (req: express.Request, res: express.Response) => {
    let name = req.body.name;
    let username = req.body.username;
    let appointments = [];
    User.findOne({ username: username }, (err, user) => {
      if (err) console.log(err);
      else {
        for (let a of user.appointments) {
          if (a.name === name) {
            a.approved = true;
          }
        }
        appointments = user.appointments;
        User.updateOne(
          { username: username },
          { $set: { appointments: appointments } },
          (err, userApp) => {
            if (err) console.log(err);
            else {
              User.findOne({ username: username }, (err, userUp) => {
                if (err) console.log(err);
                else {
                  return res.json(userUp);
                }
              });
            }
          }
        );
      }
    });
  };

  changeAppointment = (req: express.Request, res: express.Response) => {
    let appointments = [];
    let newappointment = req.body.appointment;
    let specialization = req.body.specialization;
    let oldAppointment = req.body.oldAppointment;

    User.find({ specialization: specialization }, (err, users) => {
      if (err) console.log(err);
      else {
        for (let user of users) {
          for (let i = 0; i < user.appointments.length; i++) {
            if (user.appointments[i].name === oldAppointment.name) {
              newappointment.chosen = user.appointments[i].chosen;
              break;
            }
          }
          user.appointments = user.appointments.filter(
            (a) => a.name !== oldAppointment.name
          );
          newappointment.approved = true;
          user.appointments.push(newappointment);
          User.updateOne(
            { username: user.username },
            { $set: { appointments: user.appointments } },
            (err, resp) => {
              if (err) console.log(err);
              else console.log(resp);
            }
          );
        }
        return res.json({ message: "ok" });
      }
    });
  };

  disableAppointment = (req: express.Request, res: express.Response) => {
    let appointments = [];
    let appointment = req.body.appointment;
    let specialization = req.body.specialization;

    User.find({ specialization: specialization }, (err, users) => {
      if (err) console.log(err);
      else {
        for (let user of users) {



          for (let i = 0; i < user.appointments.length; i++) {
            if (user.appointments[i].name === appointment) {
              user.appointments[i].chosen = false;
              user.appointments[i].approved = false;
              break;
            }
          }



          User.updateOne(
            { username: user.username },
            { $set: { appointments: user.appointments } },
            (err, resp) => {
              if (err) console.log(err);
              else console.log(resp);
            }
          );
        }
        return res.json({ message: "ok" });
      }
    });
  };
}
