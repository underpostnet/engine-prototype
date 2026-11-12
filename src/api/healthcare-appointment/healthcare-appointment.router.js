import { loggerFactory } from '../../server/ops/logger.js';

import { HealthcareAppointmentController } from './healthcare-appointment.controller.js';
import express from 'express';

const logger = loggerFactory(import.meta);

/** @type {import('../types.js').ApiModuleDefinition} */
export const ApiModule = {
  id: 'healthcare-appointment',
  services: ['database', 'auth', 'mailer'],
  /**
   * @param {import('../types.js').ApiRouterContext} context
   * @returns {import('express').Router}
   */
  createRouter(context) {
    const { auth } = context.services;
    const router = express.Router();
    router.post(
      `/:id`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.post(req, res, context),
    );
    router.post(`/`, async (req, res) => await HealthcareAppointmentController.post(req, res, context));
    router.get(`/appointment-dates`, async (req, res) => await HealthcareAppointmentController.get(req, res, context));
    router.get(
      `/:id`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.get(req, res, context),
    );
    router.get(
      `/`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.get(req, res, context),
    );
    router.put(
      `/:id`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.put(req, res, context),
    );
    router.put(
      `/`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.put(req, res, context),
    );
    router.delete(
      `/:id`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.delete(req, res, context),
    );
    router.delete(
      `/`,
      auth.requireModerator,
      async (req, res) => await HealthcareAppointmentController.delete(req, res, context),
    );
    return router;
  },
};
