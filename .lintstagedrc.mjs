export default {
  "apps/frontend/src/**/*.{ts,tsx}": (filenames) => {
    // Remove 'apps/frontend/' prefix to get paths relative to frontend workspace
    const relativeFiles = filenames.map((f) =>
      f.replace(/^apps\/frontend\//, "")
    );
    const fileArgs = relativeFiles.map((f) => `"${f}"`).join(" ");
    // Use workspace command to run eslint/prettier from the frontend workspace context
    return [
      `yarn workspace @presenterkit/frontend exec -- eslint --fix ${fileArgs}`,
      `yarn workspace @presenterkit/frontend exec -- prettier --write ${fileArgs}`,
    ];
  },
  "apps/backend/src/**/*.ts": (filenames) => {
    // Remove 'apps/backend/' prefix to get paths relative to backend workspace
    const relativeFiles = filenames.map((f) =>
      f.replace(/^apps\/backend\//, "")
    );
    const fileArgs = relativeFiles.map((f) => `"${f}"`).join(" ");
    // Use workspace command to run eslint/prettier from the backend workspace context
    return [
      `yarn workspace @presenterkit/backend exec -- eslint --fix ${fileArgs}`,
      `yarn workspace @presenterkit/backend exec -- prettier --write ${fileArgs}`,
    ];
  },
  "apps/backend/test/**/*.ts": (filenames) => {
    // Remove 'apps/backend/' prefix to get paths relative to backend workspace
    const relativeFiles = filenames.map((f) =>
      f.replace(/^apps\/backend\//, "")
    );
    const fileArgs = relativeFiles.map((f) => `"${f}"`).join(" ");
    // Use workspace command to run eslint/prettier from the backend workspace context
    return [
      `yarn workspace @presenterkit/backend exec -- eslint --fix ${fileArgs}`,
      `yarn workspace @presenterkit/backend exec -- prettier --write ${fileArgs}`,
    ];
  },
};
