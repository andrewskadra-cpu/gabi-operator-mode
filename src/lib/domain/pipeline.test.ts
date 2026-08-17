import test from "node:test";
import assert from "node:assert/strict";
import type { LocationOpportunity } from "./operator-state.ts";
import {
  advanceLocation,
  getNextLocationStage,
  getPipelineProgress,
} from "./pipeline.ts";

const opportunity: LocationOpportunity = {
  id: "loc-1",
  company: "North Plant",
  contact: "Jordan",
  employeesOrTraffic: "180",
  currentVending: "Incumbent",
  problems: "Slow service",
  commission: "10%",
  followUp: "Friday",
  notes: "",
  stage: "Identified",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

test("location pipeline advances one stage at a time", () => {
  assert.equal(getNextLocationStage("Identified"), "Contacted");
  assert.equal(advanceLocation(opportunity).stage, "Contacted");
  assert.equal(getNextLocationStage("Active"), "Active");
});

test("pipeline progress reaches 100 percent at Active", () => {
  assert.equal(getPipelineProgress("Identified"), 10);
  assert.equal(getPipelineProgress("Active"), 100);
});
