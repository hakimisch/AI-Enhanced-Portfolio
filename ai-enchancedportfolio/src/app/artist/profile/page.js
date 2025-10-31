"use client";
import { useEffect, useState } from "react";
import Navbar from "components/Navbar";

export default function ArtistProfilePage() {
  const [profile, setProfile] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [socials, setSocials] = useState({ instagram: "", twitter: "", website: "" });
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/artist/profile");
      const data = await res.json();
      setProfile(data);
      setAboutMe(data.aboutMe || "");
      setSocials(data.socialLinks || {});
      setImagePreview(data.profileImage || "");
    }
    fetchProfile();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("aboutMe", aboutMe);
    formData.append("instagram", socials.instagram);
    formData.append("twitter", socials.twitter);
    formData.append("website", socials.website);
    if (file) formData.append("profileImage", file);

    const res = await fetch("/api/artist/profile", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile(updated);
      setImagePreview(updated.profileImage);
      alert("Profile updated!");
    } else {
      alert("Error updating profile.");
    }
    setSaving(false);
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={imagePreview || "/placeholder.jpg"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-3 border"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            className="text-sm text-gray-600"
          />
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">About Me</label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={5}
              className="w-full border rounded p-3"
              placeholder="Tell your fans about yourself..."
            />
          </div>

          {/* Socials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Instagram URL"
            value={socials.instagram || ""}
            onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Twitter URL"
            value={socials.twitter || ""}
            onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Website"
            value={socials.website || ""}
            onChange={(e) => setSocials({ ...socials, website: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
          

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}