const PASSWORD_HASH =
  "d2d38c331fa7f35b97be5f503735932c4fb592b9c2787076b6540ac274d27e7c";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isAuth(req) {
  const pass = req.headers.get("x-admin-password");
  if (!pass) return false;
  return (await sha256(pass)) === PASSWORD_HASH;
}

function randomKey(ext) {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return (
    [...bytes].map(b => b.toString(16).padStart(2, "0")).join("") + ext
  );
}

function getType(key) {
  const ext = key.split(".").pop().toLowerCase();
  if (["mp4", "webm", "mov", "mkv"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext)) return "image";
  return "file";
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/") {
      return new Response("Media Worker ayakta 😎");
    }

    if (req.method === "POST" && url.pathname === "/upload") {
      if (!(await isAuth(req)))
        return new Response("Yetki yok", { status: 401 });

      const form = await req.formData();
      const file = form.get("file");
      if (!file) return new Response("Dosya yok", { status: 400 });

      const ext =
        "." + file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
      const key = randomKey(ext);

      await env.PHOTOS.put(key, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type }
      });

      return Response.json({
        success: true,
        key,
        url: `/media/${key}`
      });
    }

    if (req.method === "GET" && url.pathname.startsWith("/media/")) {
      const key = decodeURIComponent(url.pathname.replace("/media/", ""));
      const obj = await env.PHOTOS.get(key);
      if (!obj) return new Response("Yok", { status: 404 });

      return new Response(obj.body, {
        headers: {
          "Content-Type":
            obj.httpMetadata?.contentType || "application/octet-stream"
        }
      });
    }

    if (req.method === "GET" && url.pathname === "/admin/photos") {
      if (!(await isAuth(req)))
        return new Response("Yetki yok", { status: 401 });

      const list = await env.PHOTOS.list();

      return Response.json({
        photos: list.objects.map(o => ({
          key: o.key,
          type: getType(o.key)
        }))
      });
    }

    if (req.method === "DELETE" && url.pathname.startsWith("/admin/photo/")) {
      if (!(await isAuth(req)))
        return new Response("Yetki yok", { status: 401 });

      const key = decodeURIComponent(url.pathname.replace("/admin/photo/", ""));
      await env.PHOTOS.delete(key);

      return Response.json({ success: true });
    }

    return new Response("404", { status: 404 });
  }
};