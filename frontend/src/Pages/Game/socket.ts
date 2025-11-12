import { io, Socket } from "socket.io-client";
import { config } from "../../components/config";

const socket: Socket = io(`${config.api}`);
export default socket;