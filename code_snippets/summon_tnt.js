import { system, world } from "@minecraft/server";

world.beforeEvents.chatSend.subscribe((data) => {
    const sender = data.sender;
    const message = data.message;
    const prefix = '!';
    const commandNames = ['tnt'];

    system.run(() => {
        if (message.startsWith(prefix) === false) return; data.cancel = true;

        const args = message.slice(prefix.length).toLowerCase().split(new RegExp(/\s+/g));
        const cmd = args.shift();

        if (!commandNames.includes(cmd)) return sender.sendMessage(`Command ${cmd} is invalid.`);

        if (cmd === commandNames[0]) {
            const target = world.getPlayers({ name: args[0] })[0];
            const amountOfTnt = parseInt(args[1]);

            if (!target) return sender.sendMessage(`No player by the name ${args[0]} found.`);
            if (args.length < 1) return sender.sendMessage('You must provide two arguments.');

            for (let i = 0; i < amountOfTnt; i++) {
                target.dimension.spawnEntity('minecraft:tnt', { x: target.location.x, y: target.location.y + 2, z: target.location.z });
            }
        }
    });
});
