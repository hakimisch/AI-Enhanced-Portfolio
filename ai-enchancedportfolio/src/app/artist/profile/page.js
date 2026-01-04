// src/app/artist/profile/page.js

"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "components/DashboardLayout";

export default function ArtistProfilePage() {
  const [profile, setProfile] = useState(null);
  const [aboutMe, setAboutMe] = useState("");
  const [socials, setSocials] = useState({
    instagram: "",
    twitter: "",
    website: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null);

  const [cvFile, setCvFile] = useState(null);
  const [cvName, setCvName] = useState("");

  const [removeCv, setRemoveCv] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/artist/profile");
      const data = await res.json();

      setProfile(data);
      setAboutMe(data.aboutMe || "");
      setSocials({
        instagram: data.socialLinks?.instagram || "",
        twitter: data.socialLinks?.twitter || "",
        website: data.socialLinks?.website || "",
      });
      setImagePreview(data.profileImage || "");
      setCvName(data.cvUrl ? "Uploaded CV" : "");
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
    formData.append("removeCv", removeCv);

    if (file) formData.append("profileImage", file);
    if (cvFile) formData.append("cvFile", cvFile);

    const res = await fetch("/api/artist/profile", {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile(updated);
      setImagePreview(updated.profileImage);
      setCvName(updated.cvUrl ? "Uploaded CV" : "");
      alert("Profile updated!");
    } else {
      alert("Error updating profile.");
    }

    setSaving(false);
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-8">
        
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Artist Profile
        </h1>

        {/* Card Container */}
        <div className="bg-white shadow-md rounded-2xl p-8 space-y-8">

          {/* Profile Image */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-md ring-2 ring-purple-300 mb-3">
              <img
                src={imagePreview || "/placeholder.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm transition">
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setFile(f);
                    setImagePreview(URL.createObjectURL(f));
                  }
                }}
              />
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">

            {/* About Me */}
            <div>
              <h2 className="text-xl font-semibold mb-2">About Me</h2>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-50"
                placeholder="Tell your fans about yourself..."
              />
            </div>

            {/* Socials */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Social Links</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Instagram URL"
                  value={socials.instagram || ""}
                  onChange={(e) =>
                    setSocials({ ...socials, instagram: e.target.value })
                  }
                  className="p-3 rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  placeholder="Twitter URL"
                  value={socials.twitter || ""}
                  onChange={(e) =>
                    setSocials({ ...socials, twitter: e.target.value })
                  }
                  className="p-3 rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-400"
                />

                <input
                  type="text"
                  placeholder="Website URL"
                  value={socials.website || ""}
                  onChange={(e) =>
                    setSocials({ ...socials, website: e.target.value })
                  }
                  className="p-3 rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Curriculum Vitae (CV)</h2>
              
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm transition">
                  Upload CV (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (f) {
                        setCvFile(f);
                        setCvName(f.name);
                      }
                    }}
                  />
                </label>

                {cvName && (
                  <span className="text-gray-700 text-sm">{cvName}</span>
                )}

                {profile?.cvUrl && (
                  <div className="flex items-center gap-3">
                    <a
                      href={profile.cvUrl}
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-800 text-sm"
                    >
                      Download Current CV
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setRemoveCv(true);
                        setCvName("");
                      }}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove CV
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Save Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
