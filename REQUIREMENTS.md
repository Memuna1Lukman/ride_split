# Ride Split — Product Requirements Document (PRD)

| | |
|---|---|
| **Document status** | Initial working draft |
| **Version** | 0.2 |
| **Date** | 9 November 2026 |
| **Product type** | Ride-hailing platform with group-ride fare splitting |
| **Initial market context** | Ghana |
| **Currency** | Ghana cedi (GHS) |

---

## 1. Product overview

Ride Split is a ride-hailing platform that allows a passenger to create a ride, invite other people travelling with them, connect the group with a driver registered on Ride Split, and divide the final ride fare among the confirmed passengers.

Ride Split is its own platform. Drivers register directly on Ride Split; the product is not an integration with Uber or another ride-hailing service.

### Example scenario

Three students want to travel from KNUST to Adum.

1. One student creates a ride and enters the pickup and destination.
2. The creator invites two friends.
3. The friends accept the invitations.
4. Ride Split finds or assigns an eligible Ride Split driver.
5. The driver completes the trip.
6. If the final fare is GH₵90, the system allocates GH₵30 to each of the three confirmed passengers.
7. Each passenger is responsible for paying their own share.

The product's central promise is to make travelling together and sharing the cost straightforward, transparent, and accountable.

---

## 2. Problem statement

People travelling to the same destination may want to share a vehicle and its cost, but coordinating the ride and collecting everyone's contribution can be inconvenient.

Ride Split aims to make this easier by providing one place to:

- Create a group ride.
- Invite other registered passengers.
- Confirm who is travelling.
- Connect the group with a registered driver.
- Calculate each passenger's share of the fare.
- Track each passenger's payment separately.

---

## 3. Product goals

### 3.1 Primary goals

- Allow passengers to create and manage group rides.
- Allow a ride creator to invite other passengers.
- Ensure only passengers who have confirmed participation are included in the fare split.
- Allow registered and approved drivers to receive and accept ride requests.
- Calculate an equal fare share for each confirmed passenger.
- Track each passenger's payment responsibility independently.
- Give passengers, drivers, and administrators the information and controls appropriate to their roles.

### 3.2 Initial success indicators

The MVP should be able to demonstrate that:

- A passenger can register and sign in.
- A passenger can create a ride with valid pickup and destination locations.
- The creator can invite other registered passengers.
- Invitees can accept or decline.
- The system prevents a ride from exceeding its passenger capacity.
- An eligible driver can accept an available ride.
- The ride can progress through its permitted statuses.
- The final fare can be divided correctly among confirmed passengers.
- Each passenger's payment status can be tracked independently.

These are initial product indicators, not launch targets. Numeric targets can be defined after testing with real users.

---

## 4. Users and roles

### 4.1 Passenger

A passenger can:

- Create an account and sign in.
- Maintain a passenger profile.
- Create a ride.
- Enter pickup and destination locations.
- Invite other registered users.
- Accept or decline an invitation.
- View the ride's participants and status.
- View their own fare share and payment status.
- Cancel or leave a ride where the applicable rules permit it.

The person who creates a ride is its **creator**. The creator is also a passenger and is automatically included as a participant.

### 4.2 Driver

A driver can:

- Register on the platform.
- Submit required driver and vehicle information.
- Complete the platform's verification process.
- Set availability.
- Receive ride requests.
- Accept or reject an eligible request.
- View the pickup and destination for an assigned ride.
- Update the ride's progress using permitted status transitions.

Only drivers who have been approved by an administrator can accept rides in the MVP.

### 4.3 Administrator

An administrator can:

- Review and approve or reject driver applications.
- View and manage users, drivers, and rides.
- Review relevant ride and payment records.
- Handle basic support and operational issues.
- Investigate reported problems.

Administrative actions should be permission-controlled and recorded where appropriate.

---

## 5. MVP scope

The MVP should focus on the complete core journey rather than trying to implement every possible ride-hailing feature.

### 5.1 Passenger features

1. Registration and authentication.
2. Passenger profile.
3. Ride creation with pickup and destination.
4. Invitation of registered passengers.
5. Invitation acceptance and decline.
6. Ride participant list.
7. Ride status visibility.
8. Fare-share calculation and display.
9. Individual payment-status visibility.

### 5.2 Driver features

1. Driver registration.
2. Driver and vehicle profile submission.
3. Driver approval by an administrator.
4. Availability status.
5. Receiving available ride requests.
6. Accepting or rejecting a request.
7. Viewing ride details after assignment.
8. Updating ride progress through permitted transitions.

### 5.3 Administrator features

1. Admin authentication and authorization.
2. Driver application review.
3. Driver approval or rejection.
4. Basic user and ride visibility.
5. Basic payment and operational record visibility.

### 5.4 Initial exclusions

Do not make these prerequisites for the first working version:

- Advanced real-time driver tracking.
- Sophisticated route optimisation.
- Dynamic or surge pricing.
- Promotions, coupons, or loyalty programmes.
- Scheduled rides.
- Complex automatic ride pooling between unrelated groups.
- Microservices.
- Advanced analytics dashboards.
- Multiple payment providers.
- Automated driver payouts or settlement workflows.

These may be considered after the core workflow is reliable.

---

## 6. Core functional requirements

The identifiers below can be used when writing tests and tracking implementation progress.

### 6.1 Accounts and authentication

- **AUTH-01:** The system shall allow a user to register with the required account details.
- **AUTH-02:** The system shall allow registered users to sign in securely.
- **AUTH-03:** The system shall distinguish passenger, driver, and administrator permissions.
- **AUTH-04:** A user shall not be able to access actions or data outside their permissions.
- **AUTH-05:** The system shall validate input and handle authentication errors safely.

### 6.2 Passenger profiles

- **PASS-01:** A passenger shall have a passenger profile associated with their user account.
- **PASS-02:** A user shall not accidentally create duplicate passenger profiles for the same account.
- **PASS-03:** Only the profile owner or an appropriately authorized administrator may change protected profile information.

### 6.3 Ride creation

- **RIDE-01:** An authenticated passenger shall be able to create a ride.
- **RIDE-02:** A ride shall record its creator, pickup location, destination, creation time, and status.
- **RIDE-03:** The creator shall automatically become a participant in the ride.
- **RIDE-04:** A ride shall have a maximum passenger capacity.
- **RIDE-05:** The system shall reject invalid or incomplete ride details.
- **RIDE-06:** A ride shall not be offered to drivers until it satisfies the agreed passenger-confirmation rules.
- **RIDE-07:** Only authorized users shall be able to view or modify a ride.

### 6.4 Invitations and participants

- **INV-01:** In the MVP, only the ride creator may invite passengers.
- **INV-02:** The creator shall be able to invite registered users.
- **INV-03:** An invited user shall be able to accept or decline an invitation.
- **INV-04:** An invitation shall have a trackable status, such as pending, accepted, declined, or expired.
- **INV-05:** An invited user shall become a ride participant only after accepting the invitation.
- **INV-06:** The creator shall already be a participant and shall not be added twice.
- **INV-07:** The system shall prevent duplicate active invitations to the same user for the same ride.
- **INV-08:** The system shall prevent the ride from exceeding its passenger capacity.
- **INV-09:** The system shall prevent an unauthorized user from joining a ride.
- **INV-10:** A participant shall not be removed in a way that silently changes an already-issued fare obligation.
- **INV-11:** The system shall define a participant-freeze point after which the participant list can no longer change. At that point, every invitation still pending shall be expired and any later attempt to accept it shall be rejected. The freeze point must fall no later than the moment the final fare is recorded and obligations are generated (see FARE-03 and FARE-06). The exact ride status that triggers the freeze is an open decision (see Section 13.5).
- **INV-12:** Accepting an invitation shall be checked inside a transaction against the ride's current status, the passenger capacity, and, once a driver is assigned, the assigned vehicle's seating capacity. If any check fails, the acceptance shall be rejected.

### 6.5 Driver registration and approval

- **DRIVER-01:** A user shall be able to submit a driver application.
- **DRIVER-02:** A driver application shall contain the required driver and vehicle information.
- **DRIVER-03:** A driver shall not accept rides until approved.
- **DRIVER-04:** An administrator shall be able to approve or reject a driver application.
- **DRIVER-05:** The system shall record the driver's approval status.
- **DRIVER-06:** A driver shall be able to indicate whether they are available to receive requests.
- **DRIVER-07:** A driver shall not accept conflicting active rides.

### 6.6 Driver assignment

- **ASSIGN-01:** Only eligible, approved, available drivers shall be able to accept a ride.
- **ASSIGN-02:** A ride shall have no more than one active driver assignment in the MVP.
- **ASSIGN-03:** The system shall prevent two drivers from successfully accepting the same ride.
- **ASSIGN-04:** The assigned driver shall be able to view the ride's pickup and destination.
- **ASSIGN-05:** The system shall record which driver accepted the ride and when.
- **ASSIGN-06:** The system shall reject assignment attempts for rides that are no longer available.
- **ASSIGN-07:** The driver's vehicle shall have enough passenger seats for the ride's confirmed participants at the time of acceptance. Until the participant-freeze point (INV-11), the vehicle shall also have enough seats for the ride's maximum passenger capacity, or the ride's capacity shall be reduced to the vehicle's seat count at assignment. Which of these two rules applies is an open decision (see Section 13.5).
- **ASSIGN-08:** Driver eligibility (approved, available, and not holding a conflicting active ride) and ride availability shall be checked inside the same transaction that creates the assignment. The driver profile and the ride shall be locked, or an equivalent concurrency guard used, so that a status change or a competing acceptance cannot slip in between the check and the assignment. A driver who is offline or unapproved when the transaction runs shall not be assigned the ride, whatever the result of an earlier check.

### 6.7 Ride progress

Use explicit ride statuses and validate every status change.

**Proposed ride lifecycle:**

```
DRAFT → GATHERING_PASSENGERS → READY_FOR_DRIVER → DRIVER_ASSIGNED → DRIVER_ARRIVING → IN_PROGRESS → COMPLETED
```

**Possible terminal alternatives:**

- `CANCELLED`
- `EXPIRED`

**Requirements:**

- **STATUS-01:** The system shall store the current ride status.
- **STATUS-02:** Only permitted status transitions shall be accepted.
- **STATUS-03:** Only authorized actors shall be allowed to perform each transition.
- **STATUS-04:** The system shall record important status changes with timestamps.
- **STATUS-05:** A completed, cancelled, or expired ride shall not return to an earlier active state without an explicitly designed recovery process.

The exact transition permissions should be documented before implementation. For example, a driver may mark a ride as arriving or in progress, while a passenger or administrator may have different cancellation permissions.

### 6.8 Fare splitting

- **FARE-01:** The initial fare-splitting rule shall be an equal split among confirmed participants.
- **FARE-02:** Only confirmed participants shall receive a fare obligation.
- **FARE-03:** The final fare shall be recorded before final payment obligations are generated.
- **FARE-04:** The sum of all passenger shares shall equal the final ride fare exactly.
- **FARE-05:** The system shall handle indivisible amounts without losing or creating money.
- **FARE-06:** Once payment obligations have been generated, they shall not be silently recalculated.
- **FARE-07:** Each passenger shall be responsible for their own share by default.
- **FARE-08:** The system shall retain enough information to explain how each share was calculated.

**Money representation:** Store monetary values as integer pesewas, not floating-point numbers. For example, GH₵30.00 is 3,000 pesewas.

**Rounding example:** If a fare of GH₵100.00 is split among three passengers, the shares could be GH₵33.34, GH₵33.33, and GH₵33.33. The extra pesewa must be assigned using a deterministic, documented rule so the shares always add up to the original fare.

### 6.9 Payments

Keep the passenger's payment responsibility separate from the record of an attempt to pay.

- **PAY-01:** The system shall create a separate payment obligation for each confirmed passenger after the final fare is established.
- **PAY-02:** Each obligation shall identify the ride, passenger, amount due, and payment status.
- **PAY-03:** The system shall track payment attempts separately from payment obligations.
- **PAY-04:** A failed attempt shall not erase the payment obligation.
- **PAY-05:** The system shall support recording retries without creating duplicate successful charges.
- **PAY-06:** The system shall verify payment-provider notifications before marking an obligation as paid.
- **PAY-07:** The system shall keep each passenger's payment status independent.
- **PAY-08:** An unpaid passenger's share shall not automatically be charged to another passenger.
- **PAY-09:** The system shall retain provider references and relevant payment events for reconciliation.

The initial product decision about how passengers actually pay is still open. The data model should not assume that a payment is successful merely because a passenger clicks a button.

> **Important implementation note:** Payment-provider integration, mobile-money support, refunds, driver settlement, and applicable Ghanaian regulatory requirements must be investigated before real-money launch. Do not store card details or payment-provider secrets in application tables or source code.

---

## 7. Business rules and invariants

These rules must remain true even when requests arrive concurrently or users behave unexpectedly.

1. The ride creator is automatically a participant.
2. A user cannot be a participant twice in the same ride.
3. Only accepted invitations create invited participants.
4. The ride cannot exceed its passenger capacity.
5. Only approved drivers can accept rides.
6. A ride cannot have multiple active driver assignments in the MVP.
7. A driver cannot accept conflicting active rides.
8. Only confirmed participants are included in the fare split.
9. The sum of all fare shares must equal the final fare exactly.
10. Money is stored in integer pesewas.
11. A payment failure does not erase the amount owed.
12. A passenger's payment status is independent of other passengers' payment statuses.
13. Payment obligations are not silently changed after creation.
14. Every important status change must be authorized and recorded.
15. The backend, not the frontend, is responsible for enforcing these rules.
16. The participant list is frozen once obligations are generated, and no invitation can be accepted after the freeze point.
17. A ride is only assigned to a vehicle with enough seats for its confirmed participants.

Use database constraints and transactions where appropriate. Application-level checks alone may not prevent race conditions.

---

## 8. Initial data model — entities to investigate

This is a starting list for designing an ERD. It is not a final schema. Decide the attributes, constraints, relationships, and optionality before writing database models.

| Entity | Purpose |
|---|---|
| `users` | Shared account and authentication identity |
| `passenger_profiles` | Passenger-specific information |
| `driver_profiles` | Driver-specific information and approval status |
| `vehicles` | Vehicles registered by drivers, including passenger seating capacity |
| `rides` | Ride request, locations, creator, capacity, fare, and status |
| `ride_invitations` | Invitations sent to prospective passengers |
| `ride_participants` | Users confirmed as travelling on a ride |
| `ride_assignments` | Driver assignment history or active assignment |
| `payments` | Amount each passenger is obligated to pay |
| `payment_transactions` | Individual attempts and provider payment events |

### Relationship questions to resolve in the ERD

- Can one user have both a passenger profile and a driver profile?
- Can one driver register more than one vehicle?
- How will the database guarantee that the creator is a participant?
- How will duplicate participants and duplicate invitations be prevented?
- How will one active driver assignment per ride be enforced?
- What should happen to invitations when a ride is cancelled or expires?
- How will the database represent a passenger leaving or cancelling?
- How will a fare obligation remain traceable to the exact participant and fare calculation?
- Can a payment obligation have multiple payment attempts?
- Which records should be retained for audit and reconciliation?

Do not assume that every relationship is one-to-one or one-to-many without considering the actual business rule.

---

## 9. Location and geospatial requirements

Ride Split needs to store pickup and destination locations and may later need to find nearby drivers.

**Initial technical direction:**

- Use PostgreSQL as the relational database.
- Investigate PostGIS for geographic data and spatial queries.
- Consider `GEOGRAPHY(POINT, 4326)` for pickup and destination points when measuring real-world distances.
- Learn longitude, latitude, coordinate reference systems, and SRID 4326.
- Add suitable spatial indexes, such as GiST indexes, when needed.
- Investigate `ST_DWithin` for finding drivers within a chosen radius of a pickup point.

A proximity query can identify nearby drivers, but it does not calculate a road route, travel time, or turn-by-turn navigation. Those require a routing or maps service and should be treated as a separate integration.

For the first version, it is acceptable to store and validate pickup and destination coordinates before implementing sophisticated driver matching.

---

## 10. Non-functional requirements

### Security and privacy

- Passwords must be stored using an appropriate password-hashing algorithm, never as plaintext.
- Secrets and credentials must be kept outside source control.
- Validate and normalize user input.
- Enforce authorization on the backend for every protected operation.
- Prevent users from reading or changing another user's private records without permission.
- Protect sensitive driver and passenger information.
- Avoid exposing exact location information to users who do not need it.
- Log security-relevant events without logging passwords, tokens, or sensitive payment data.

### Reliability and data integrity

- Use database transactions for operations that update related records.
- Protect ride acceptance and payment processing against duplicate or concurrent requests.
- Use appropriate unique constraints and foreign keys.
- Handle errors without leaving partially updated business records.
- Preserve an auditable history of important ride and payment events.

### Maintainability

- Keep the initial backend as a modular monolith.
- Separate API routing, business logic, data access, and validation responsibilities.
- Organize code by product domain.
- Write tests for business rules and important edge cases.
- Use database migrations to evolve the schema.
- Document important technical decisions.

### Performance

- Add indexes based on actual query patterns.
- Avoid loading unnecessary related records.
- Consider spatial indexes for geospatial queries.
- Do not introduce premature infrastructure complexity.

---

## 11. Suggested technical direction

These are initial choices to validate, not instructions to copy without understanding.

| Area | Initial direction |
|---|---|
| Backend language | Python |
| API framework | FastAPI |
| Database | PostgreSQL |
| Geospatial extension | PostGIS |
| ORM | SQLAlchemy |
| Database migrations | Alembic |
| API style | REST for the initial MVP |
| Architecture | Modular monolith |
| Testing | pytest |
| Version control | Git |

**Suggested domain modules:**

- identity
- passengers
- drivers
- vehicles
- rides
- invitations
- geospatial
- payments
- notifications
- administration

A module can contain models, schemas, repositories, services, routers, and tests where useful. Avoid creating empty abstractions just to make the folder structure look sophisticated.

---

## 12. Proposed development sequence

Build in small, testable stages. Do not implement the entire platform at once.

### Stage 1 — Understand and design

- Read this requirements document.
- Identify unclear or conflicting requirements.
- Resolve the open product decisions in Section 13.
- Draw an ERD.
- Define the first ride and invitation state transitions.
- Write down the assumptions behind the design.

**Deliverable:** Reviewed ERD and a short set of documented business rules.

### Stage 2 — Project foundation

- Create the project repository and Python environment.
- Configure FastAPI.
- Configure application settings and environment variables.
- Connect to PostgreSQL.
- Configure SQLAlchemy and Alembic.
- Add a basic health-check endpoint.

**Deliverable:** Application starts, connects to the database, and can run migrations.

### Stage 3 — Accounts and profiles

- Implement registration and authentication.
- Implement role and permission checks.
- Implement passenger profiles.
- Implement driver applications and profiles.
- Add tests for authentication and authorization.

**Deliverable:** A passenger can register and sign in; a driver can submit an application.

### Stage 4 — Driver and vehicle administration

- Implement vehicle records.
- Implement admin review and driver approval.
- Implement driver availability.
- Test that unapproved drivers cannot accept rides.

**Deliverable:** An administrator can approve a driver and the driver can become available.

### Stage 5 — Ride creation

- Implement ride creation.
- Validate pickup, destination, and capacity.
- Automatically add the creator as a participant.
- Implement ride retrieval with correct authorization.
- Test invalid and duplicate operations.

**Deliverable:** A passenger can create and view a valid ride.

### Stage 6 — Invitations and participants

- Implement invitation creation.
- Implement accept and decline.
- Prevent duplicate invitations and participants.
- Enforce capacity under concurrent requests.
- Define invitation expiry and cancellation behavior.

**Deliverable:** A creator can invite friends and accepted invitees appear as participants.

### Stage 7 — Driver assignment and ride lifecycle

- Implement the eligible-driver query or initial request distribution method.
- Implement safe ride acceptance.
- Prevent multiple active assignments.
- Implement permitted ride status transitions.
- Record status history.

**Deliverable:** An approved driver can accept a ride and progress it through the ride lifecycle.

### Stage 8 — Fare calculation

- Implement equal splitting in integer pesewas.
- Define and test the remainder-allocation rule.
- Generate one fare obligation per confirmed participant.
- Ensure the shares sum exactly to the final fare.

**Deliverable:** The system calculates correct, traceable fare shares.

### Stage 9 — Payments

- Decide the initial payment method and provider.
- Implement payment obligations and payment attempts separately.
- Verify provider callbacks or notifications.
- Handle failure, retry, duplicate notification, and reconciliation cases.
- Investigate refunds and driver settlement before real-money operation.

**Deliverable:** Payment states can be recorded and verified safely in a test environment.

### Stage 10 — Testing and release preparation

- Test the complete passenger journey.
- Test the driver journey.
- Test admin permissions.
- Test cancellation, expiry, failures, and concurrency.
- Review security and privacy.
- Prepare deployment configuration and operational documentation.

**Deliverable:** A tested MVP suitable for controlled user testing.

---

## 13. Open product decisions

These decisions were not fully settled in the initial discussion. Record the selected option and the reason before implementing the affected behavior.

### 13.1 When is the fare split calculated?

Options:

- **A. Estimate before the ride:** Passengers see and accept an estimated share before the ride.
- **B. Actual fare after the ride:** The split is calculated only after the trip is complete and the final fare is known.
- **C. Estimate then reconcile:** Passengers see an estimate before the ride; the final fare is split after completion.

**Decision:** To be confirmed.

### 13.2 What happens if an invited passenger declines?

Options:

- **A.** Continue with the remaining passengers.
- **B.** Require the creator to invite a replacement before proceeding.
- **C.** Let the creator decide whether the group should continue.

**Decision:** To be confirmed.

### 13.3 Can passengers join without an invitation?

Options:

- **A.** No. The creator must invite every passenger.
- **B.** Yes, but the creator must approve the request.
- **C.** Yes, if the ride has capacity and the route is suitable.

**Initial MVP direction:** Invitation-only is the simplest starting point, subject to confirmation.

### 13.4 How do passengers pay?

Options:

- **A.** Each passenger pays through Ride Split.
- **B.** Each passenger pays the driver individually.
- **C.** Support both methods.

**Decision:** To be confirmed. Investigate provider support, reconciliation, refunds, and operational implications before selecting an approach.

### 13.5 Additional decisions to make before the relevant feature is built

- What is the minimum number of confirmed passengers required before a ride can be offered to drivers?
- At which ride status does the participant-freeze point (INV-11) occur: when a driver is assigned, when the trip starts, or when the trip completes? What happens to pending invitations at that point?
- How is vehicle seating capacity applied (ASSIGN-07): offer a ride only to drivers whose vehicle fits the maximum capacity, or shrink the ride's capacity to the vehicle's seats at assignment? Can a passenger accept an invitation after assignment if seats remain?
- Can the creator proceed alone if nobody accepts the invitation?
- How long does an invitation remain valid?
- When can a passenger cancel or leave a ride?
- What happens if a passenger does not show up?
- What is the cancellation policy after a driver accepts?
- Who sets the final fare, and at what point?
- Can the final fare differ from an estimate, and how is that communicated?
- How are driver requests distributed: broadcast to eligible drivers, offered one at a time, or selected by an administrator?
- When is payment due: before, during, or after the ride?
- What happens if one passenger does not pay?
- What is the process for refunds, disputes, and driver settlement?

> Do not silently invent answers to these questions in code. Make a decision, record the reason, and update this document.

---

## 14. Testing expectations

At minimum, write tests for the following cases.

### Accounts and permissions

- A user can register and sign in.
- Invalid credentials are rejected.
- A passenger cannot perform an admin-only action.
- A user cannot modify another user's protected profile.

### Rides and invitations

- Creating a ride automatically adds the creator as a participant.
- An invitee becomes a participant only after accepting.
- Declining an invitation does not add the invitee.
- Duplicate invitations and duplicate participants are rejected.
- Passenger capacity cannot be exceeded.
- An unauthorized user cannot accept an invitation intended for someone else.
- Cancelled or expired rides cannot be accepted by a driver.
- An invitation cannot be accepted after the participant-freeze point, and pending invitations are expired at that point.
- Accepting an invitation after driver assignment is rejected if it would exceed the assigned vehicle's seating capacity.

### Drivers and assignments

- An unapproved driver cannot accept a ride.
- An unavailable driver cannot accept a ride.
- Two drivers cannot accept the same ride concurrently.
- A driver cannot accept conflicting active rides.
- A driver whose vehicle has too few seats for the ride's confirmed participants cannot accept it.
- A driver who goes offline or loses approval between the eligibility check and the acceptance transaction cannot be assigned the ride.

### Fare and payments

- Equal shares are calculated correctly.
- Remainder pesewas are allocated deterministically.
- The sum of shares always equals the final fare.
- Only confirmed participants receive obligations.
- A failed payment attempt leaves the obligation unpaid.
- Repeated provider notifications do not create duplicate successful payments.
- One passenger's payment does not change another passenger's payment status.

---

## 15. Definition of MVP completion

The MVP is ready for controlled testing when a complete basic scenario works:

1. A passenger registers and signs in.
2. The passenger creates a ride with a pickup, destination, and capacity.
3. The creator invites other registered passengers.
4. Invitees accept or decline.
5. The system enforces the agreed rules for whether the ride can proceed.
6. An approved, available driver accepts the ride.
7. The driver progresses the ride through valid statuses.
8. The final fare is recorded.
9. The system calculates equal shares for confirmed participants, with exact pesewa accounting.
10. Each passenger's payment obligation and payment status can be viewed independently.
11. Invalid actions are rejected, permissions are enforced, and important events are recorded.

A polished frontend is not required to prove the backend workflow. A documented API and tests can demonstrate the first working version.

---

## 16. Engineering journal

Keep a short journal as the project develops. For each stage, record:

- What I intended to build.
- What I implemented myself.
- What problem I encountered.
- What I tried before asking for help.
- What I learned.
- What I changed and why.
- What I can now explain without assistance.
- What remains uncertain.

### Working rule for AI assistance

Use AI as a tutor, reviewer, and debugging partner — not as a substitute for understanding.

1. Try to break the task into smaller steps yourself.
2. Make an honest implementation attempt.
3. Read official documentation and investigate errors.
4. If stuck, ask for a hint or explanation before requesting a complete solution.
5. If AI provides an example, understand it and reproduce the idea yourself.
6. Ask for a review of your code and the reasoning behind any suggested changes.
7. Do not keep code you cannot explain.
8. Write tests and verify behavior rather than trusting that code looks correct.

The goal is not to avoid AI. The goal is to become capable of making and defending engineering decisions while using AI effectively.

---

## 17. First task

**Do not start by writing the application code.**

Begin with Stage 1:

1. Read this document carefully.
2. Write down the requirements you believe are ambiguous.
3. Answer the four product decisions in Section 13.1–13.4.
4. Draw the first ERD using the entities in Section 8 as a starting point.
5. For every relationship, identify its cardinality and whether it is optional or mandatory.
6. Add primary keys, foreign keys, unique constraints, and important business constraints.
7. Be prepared to explain why each entity and relationship exists.

The first ERD does not need to be perfect. It is a design hypothesis that can be reviewed and improved before implementation.

**First milestone:** A clear, explainable ERD and documented product decisions — not a large amount of code.