import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadProfilePicture } from '../../lib/supabaseClient';

interface ProfileImageUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

type Mode = 'upload' | 'url' | 'camera';

export function ProfileImageUploader({ value, onChange }: ProfileImageUploaderProps) {
  const [mode, setMode] = useState<Mode>('upload');
  const [preview, setPreview] = useState<string | null>(value);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  useEffect(() => {
    if (mode !== 'camera') {
      stopStream();
    } else {
      startCamera();
    }
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Camera not supported on this device.');
      setMode('upload');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to access camera.');
      setMode('upload');
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadProfilePicture(file);
      onChange(publicUrl);
      setPreview(publicUrl);
      toast.success('Profile photo uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload file');
    }
    setUploading(false);
  };

  const handleUrlSet = () => {
    if (!urlInput.trim()) {
      onChange(null);
      setPreview(null);
      return;
    }
    onChange(urlInput.trim());
    setPreview(urlInput.trim());
    toast.success('Profile photo updated');
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setUploading(true);
      try {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        const publicUrl = await uploadProfilePicture(file);
        onChange(publicUrl);
        setPreview(publicUrl);
        toast.success('Photo captured');
        setMode('upload');
      } catch (error) {
        console.error(error);
        toast.error('Failed to capture photo');
      }
      setUploading(false);
    }, 'image/jpeg');
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex gap-2">
        {(['upload', 'url', 'camera'] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition ${
              mode === item ? 'border-brand-light bg-brand-light/20 text-brand-muted' : 'border-slate-800 text-slate-300'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {preview && (
        <img src={preview} alt="Profile" className="h-32 w-32 rounded-2xl object-cover" />
      )}
      {mode === 'upload' && (
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-5 text-sm text-slate-400 hover:border-brand-light">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          {uploading ? 'Uploading...' : 'Upload profile image'}
        </label>
      )}
      {mode === 'url' && (
        <div className="space-y-2">
          <input
            placeholder="https://example.com/photo.jpg"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
          />
          <button
            type="button"
            onClick={handleUrlSet}
            className="rounded-lg bg-brand-light px-3 py-2 text-sm font-semibold text-white hover:bg-brand"
          >
            Save URL
          </button>
        </div>
      )}
      {mode === 'camera' && (
        <div className="space-y-3">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl border border-slate-800" />
          <button
            type="button"
            disabled={uploading}
            onClick={handleCapture}
            className="w-full rounded-lg bg-brand-light px-3 py-2 text-sm font-semibold text-white hover:bg-brand disabled:opacity-60"
          >
            {uploading ? 'Processing...' : 'Capture Photo'}
          </button>
        </div>
      )}
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setPreview(null);
          }}
          className="text-xs font-semibold text-rose-300 hover:text-rose-200"
        >
          Remove profile photo
        </button>
      )}
    </div>
  );
}
