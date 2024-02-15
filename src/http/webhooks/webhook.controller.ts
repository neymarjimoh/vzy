import express, { Request, Response, Router } from "express";
import Stripe from "stripe";
import envs from "../../config/envs";
import User from "../../models/user.model";
import { userService } from "../../services/user.service";
import { Status } from "../../utils/enum.util";

const webhookRouter = Router();

webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const stripe = new Stripe(envs.secrets.stripe);
      console.log("jsjson", req);
      const sig = req.headers["stripe-signature"];

      let event:
        | Stripe.Event
        | Stripe.ChargeSucceededEvent
        | Stripe.PaymentIntentSucceededEvent;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          envs.secrets.stripe
        );
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      const paymentIntentSucceeded = event.data.object;
      switch (event.type) {
        case "payment_intent.succeeded":
        case "charge.succeeded":
          await processSuccessfulPayment(
            paymentIntentSucceeded as
              | Stripe.ChargeSucceededEvent
              | Stripe.PaymentIntentSucceededEvent
          );
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.log(
        "Stripe Webhook Error: Could not process stripe payments webhook",
        `Webhook Payload ===> ${JSON.stringify(req.body)}`,
        error.message ?? "",
        error?.response?.data?.message ?? ""
      );
      return res.sendStatus(400);
    }
  }
);

const processSuccessfulPayment = async (
  data: Stripe.PaymentIntentSucceededEvent | Stripe.ChargeSucceededEvent
) => {
  // use this to simulate handling transactions
  console.log("here", JSON.stringify(data));
  //   {
  //     "id": "evt_3Ojxr8L0rfAwd1t90DbBqD24",
  //     "object": "event",
  //     "api_version": "2019-12-03",
  //     "created": 1707976295,
  //     "data": {
  //       "object": {
  //         "id": "pi_3Ojxr8L0rfAwd1t90G7cTmvu",
  //         "object": "payment_intent",
  //         "amount": 2000,
  //         "amount_capturable": 0,
  //         "amount_details": {
  //           "tip": {
  //           }
  //         },
  //         "amount_received": 2000,
  //         "application": null,
  //         "application_fee_amount": null,
  //         "automatic_payment_methods": null,
  //         "canceled_at": null,
  //         "cancellation_reason": null,
  //         "capture_method": "automatic",
  //         "charges": {
  //           "object": "list",
  //           "data": [
  //             {
  //               "id": "ch_3Ojxr8L0rfAwd1t90WFiZMxk",
  //               "object": "charge",
  //               "amount": 2000,
  //               "amount_captured": 2000,
  //               "amount_refunded": 0,
  //               "application": null,
  //               "application_fee": null,
  //               "application_fee_amount": null,
  //               "balance_transaction": "txn_3Ojxr8L0rfAwd1t90JPrj3lr",
  //               "billing_details": {
  //                 "address": {
  //                   "city": null,
  //                   "country": null,
  //                   "line1": null,
  //                   "line2": null,
  //                   "postal_code": null,
  //                   "state": null
  //                 },
  //                 "email": null,
  //                 "name": null,
  //                 "phone": null
  //               },
  //               "calculated_statement_descriptor": "Stripe",
  //               "captured": true,
  //               "created": 1707976294,
  //               "currency": "usd",
  //               "customer": null,
  //               "description": "(created by Stripe CLI)",
  //               "destination": null,
  //               "dispute": null,
  //               "disputed": false,
  //               "failure_balance_transaction": null,
  //               "failure_code": null,
  //               "failure_message": null,
  //               "fraud_details": {
  //               },
  //               "invoice": null,
  //               "livemode": false,
  //               "metadata": {
  //               },
  //               "on_behalf_of": null,
  //               "order": null,
  //               "outcome": {
  //                 "network_status": "approved_by_network",
  //                 "reason": null,
  //                 "risk_level": "normal",
  //                 "risk_score": 23,
  //                 "seller_message": "Payment complete.",
  //                 "type": "authorized"
  //               },
  //               "paid": true,
  //               "payment_intent": "pi_3Ojxr8L0rfAwd1t90G7cTmvu",
  //               "payment_method": "pm_1Ojxr8L0rfAwd1t99np6HeUp",
  //               "payment_method_details": {
  //                 "card": {
  //                   "amount_authorized": 2000,
  //                   "brand": "visa",
  //                   "checks": {
  //                     "address_line1_check": null,
  //                     "address_postal_code_check": null,
  //                     "cvc_check": "pass"
  //                   },
  //                   "country": "US",
  //                   "exp_month": 2,
  //                   "exp_year": 2025,
  //                   "extended_authorization": {
  //                     "status": "disabled"
  //                   },
  //                   "fingerprint": "13VXHIewH1yLjDVh",
  //                   "funding": "credit",
  //                   "incremental_authorization": {
  //                     "status": "unavailable"
  //                   },
  //                   "installments": null,
  //                   "last4": "4242",
  //                   "mandate": null,
  //                   "multicapture": {
  //                     "status": "unavailable"
  //                   },
  //                   "network": "visa",
  //                   "network_token": {
  //                     "used": false
  //                   },
  //                   "overcapture": {
  //                     "maximum_amount_capturable": 2000,
  //                     "status": "unavailable"
  //                   },
  //                   "three_d_secure": null,
  //                   "wallet": null
  //                 },
  //                 "type": "card"
  //               },
  //               "radar_options": {
  //               },
  //               "receipt_email": null,
  //               "receipt_number": null,
  //               "receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xRzFCRzNMMHJmQXdkMXQ5KOfMtq4GMgYlBL5BY8E6LBZzf_HwUSqncaMGwbi0T8TtaQ_6qXLh5po983hqt5WtdG9SrsKInDc5vX20",
  //               "refunded": false,
  //               "refunds": {
  //                 "object": "list",
  //                 "data": [
  //                 ],
  //                 "has_more": false,
  //                 "total_count": 0,
  //                 "url": "/v1/charges/ch_3Ojxr8L0rfAwd1t90WFiZMxk/refunds"
  //               },
  //               "review": null,
  //               "shipping": {
  //                 "address": {
  //                   "city": "San Francisco",
  //                   "country": "US",
  //                   "line1": "510 Townsend St",
  //                   "line2": null,
  //                   "postal_code": "94103",
  //                   "state": "CA"
  //                 },
  //                 "carrier": null,
  //                 "name": "Jenny Rosen",
  //                 "phone": null,
  //                 "tracking_number": null
  //               },
  //               "source": null,
  //               "source_transfer": null,
  //               "statement_descriptor": null,
  //               "statement_descriptor_suffix": null,
  //               "status": "succeeded",
  //               "transfer_data": null,
  //               "transfer_group": null
  //             }
  //           ],
  //           "has_more": false,
  //           "total_count": 1,
  //           "url": "/v1/charges?payment_intent=pi_3Ojxr8L0rfAwd1t90G7cTmvu"
  //         },
  //         "client_secret": "pi_3Ojxr8L0rfAwd1t90G7cTmvu_secret_EErNRfHP2H4rtGRSRAFwMDJI9",
  //         "confirmation_method": "automatic",
  //         "created": 1707976294,
  //         "currency": "usd",
  //         "customer": null,
  //         "description": "(created by Stripe CLI)",
  //         "invoice": null,
  //         "last_payment_error": null,
  //         "latest_charge": "ch_3Ojxr8L0rfAwd1t90WFiZMxk",
  //         "livemode": false,
  //         "metadata": {
  //         },
  //         "next_action": null,
  //         "on_behalf_of": null,
  //         "payment_method": "pm_1Ojxr8L0rfAwd1t99np6HeUp",
  //         "payment_method_configuration_details": null,
  //         "payment_method_options": {
  //           "card": {
  //             "installments": null,
  //             "mandate_options": null,
  //             "network": null,
  //             "request_three_d_secure": "automatic"
  //           }
  //         },
  //         "payment_method_types": [
  //           "card"
  //         ],
  //         "processing": null,
  //         "receipt_email": null,
  //         "review": null,
  //         "setup_future_usage": null,
  //         "shipping": {
  //           "address": {
  //             "city": "San Francisco",
  //             "country": "US",
  //             "line1": "510 Townsend St",
  //             "line2": null,
  //             "postal_code": "94103",
  //             "state": "CA"
  //           },
  //           "carrier": null,
  //           "name": "Jenny Rosen",
  //           "phone": null,
  //           "tracking_number": null
  //         },
  //         "source": null,
  //         "statement_descriptor": null,
  //         "statement_descriptor_suffix": null,
  //         "status": "succeeded",
  //         "transfer_data": null,
  //         "transfer_group": null
  //       }
  //     },
  //     "livemode": false,
  //     "pending_webhooks": 2,
  //     "request": {
  //       "id": "req_nxrsA4w4uA9Cn5",
  //       "idempotency_key": "e8a8eb18-af3f-4405-b4e4-6149fef2dbeb"
  //     },
  //     "type": "payment_intent.succeeded"
  //   }

  const user = await User.findById(data.id);

  if (!user) {
    return;
  }

  if (user.status === Status.Paid) return;

  await userService.updateUser({ _id: data.id }, { status: Status.Paid });
};

export default webhookRouter;
