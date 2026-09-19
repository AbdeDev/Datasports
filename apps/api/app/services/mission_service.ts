import { DateTime } from "luxon";
import Mission from "#models/mission";
import MissionTarget from "#models/mission_target";
import type User from "#models/user";

class MissionForbiddenError extends Error {}
class MissionConflictError extends Error {}

export { MissionForbiddenError, MissionConflictError };

export default class MissionService {
  async listForUser(user: User) {
    const query = Mission.query()
      .preload("match", (matchQuery) => matchQuery.preload("homeClub").preload("awayClub"))
      .preload("scout")
      .preload("targets", (targetQuery) => targetQuery.preload("player"))
      .orderBy("created_at", "desc");

    if (user.role !== "admin") {
      query.where("scout_id", user.id);
    }

    return query;
  }

  async findForUser(missionId: number, user: User) {
    const mission = await Mission.query()
      .where("id", missionId)
      .preload("match", (matchQuery) => matchQuery.preload("homeClub").preload("awayClub"))
      .preload("scout")
      .preload("targets", (targetQuery) => targetQuery.preload("player"))
      .preload("observations")
      .firstOrFail();

    if (user.role !== "admin" && mission.scoutId !== user.id) {
      throw new MissionForbiddenError("This mission does not belong to you");
    }

    return mission;
  }

  async create(data: { matchId: number; scoutId: number; playerIds: number[] }, createdBy: User) {
    const mission = await Mission.create({
      matchId: data.matchId,
      scoutId: data.scoutId,
      createdBy: createdBy.id,
      status: "proposee",
    });

    await MissionTarget.createMany(
      data.playerIds.map((playerId) => ({ missionId: mission.id, playerId })),
    );

    return this.findForUser(mission.id, createdBy);
  }

  async respond(
    missionId: number,
    scout: User,
    data: { decision: "accept" | "decline"; declineReason?: string },
  ) {
    const mission = await Mission.findOrFail(missionId);

    if (mission.scoutId !== scout.id) {
      throw new MissionForbiddenError("This mission does not belong to you");
    }

    if (mission.status !== "proposee") {
      throw new MissionConflictError("This mission is not awaiting a response");
    }

    mission.status = data.decision === "accept" ? "acceptee" : "a_reattribuer";
    mission.declineReason = data.decision === "decline" ? (data.declineReason ?? null) : null;
    mission.respondedAt = DateTime.now();
    await mission.save();

    return this.findForUser(mission.id, scout);
  }

  async reassign(missionId: number, newScoutId: number, admin: User) {
    const mission = await Mission.findOrFail(missionId);

    if (!["proposee", "a_reattribuer"].includes(mission.status)) {
      throw new MissionConflictError("Only a pending or unassigned mission can be reassigned");
    }

    mission.scoutId = newScoutId;
    mission.status = "proposee";
    mission.declineReason = null;
    mission.respondedAt = null;
    await mission.save();

    return this.findForUser(mission.id, admin);
  }
}
