import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/media', express.static(__dirname));

app.post('/api/projects', upload.fields([{ name: 'productImage', maxCount: 1 }, { name: 'personaImage', maxCount: 1 }]), (req, res) => {
  const id = Date.now().toString();
  const { persona, clothing, customClothing, tone, brandName, productName, description, ctaLink } = req.body;
  
  const productImageUrl = req.files && req.files['productImage'] ? `/uploads/${req.files['productImage'][0].filename}` : '';
  const personaImageUrl = req.files && req.files['personaImage'] ? `/uploads/${req.files['personaImage'][0].filename}` : '';
  const finalClothing = clothing === 'custom' ? customClothing : clothing;
  const videoAspectRatio = '9:16';

  const stmt = db.prepare(`
    INSERT INTO projects (id, persona, personaImageUrl, clothing, tone, brandName, productName, description, productImageUrl, ctaLink, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([id, persona, personaImageUrl, finalClothing, tone, brandName, productName, description, productImageUrl, ctaLink, 'script_generating'], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    setTimeout(() => {
      generateScript(id, { brandName, productName, description, tone, persona, clothing: finalClothing, productImageUrl, personaImageUrl, aspectRatio: videoAspectRatio });
    }, 100);

    res.json({ id, status: 'script_generating' });
  });
});

app.get('/api/projects/:id', (req, res) => {
  db.get(`SELECT * FROM projects WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(row);
  });
});

function generateScript(id, data) {
  const toneText = data.tone === 'friendly' ? 'friendly and casual' : 
                   data.tone === 'professional' ? 'professional and elegant' : 'hype and energetic';
  
  const script = `Halo semuanya! Selamat datang di channel ${data.brandName}! Perkenalkan, saya here to tell you about ${data.productName}! 

Ini dia produk yang luar biasa banget - ${data.description}! 

Coba lihat quality nya, premium banget kan? Bahan nya premium, design nya modern, dan cocok banget untuk daily use atau acara special!

Nah yang bikin spesial, produk ini punya banyak fitur Unggulan. Pertama, comfort nya top notch - bisa dipakai seharian tanpa rasa tidak nyaman. Kedua, durabilitas nya juara - tahan lama dan tidak mudah rusak. Ketiga, price nya sangat affordable untuk kualitas segini!

Buat kalian yang interested, jangan lewatkan promo special ini ya! Link purchase sudah tersedia di bawah video ini. Klik tombol buy sekarang dan jangan sampai kehabisan stock!

Terima kasih sudah menonton! Jangan lupa like, comment, dan subscribe untuk konten menarik lainnya. See you di video berikutnya!`;
  
  db.run(`UPDATE projects SET script = ?, status = ? WHERE id = ?`, [script, 'video_generating', id], (err) => {
    if (err) console.error(err);
    else {
      setTimeout(() => {
        generateMedia(id, { ...data, script });
      }, 2000);
    }
  });
}

const execPromise = util.promisify(exec);

async function generateMedia(id, data) {
  console.log(`[Project ${id}] Starting multi-shot PixVerse generation pipeline...`);
  db.run(`UPDATE projects SET status = ? WHERE id = ?`, ['video_generating', id]);

  try {
    const personaImagePath = data.persona === 'custom' && data.personaImageUrl
      ? path.join(__dirname, 'uploads', path.basename(data.personaImageUrl))
      : null;

    const productImagePath = data.productImageUrl
      ? path.join(__dirname, 'uploads', path.basename(data.productImageUrl))
      : null;

    const aspectRatio = data.aspectRatio || '9:16';
    const safeScript = data.script.replace(/"/g, "'");
    
    const personaType = data.persona === 'paijo' ? 'Indonesian handsome man with neat beard, corporate professional' : 
                        data.persona === 'mbaijo' ? 'Indonesian beautiful woman with long black hair, professional' : 'person';
    const personaDesc = data.persona === 'custom' ? 'custom uploaded person' : personaType;

    console.log(`[Project ${id}] Aspect ratio: ${aspectRatio}`);
    console.log(`[Project ${id}] Persona: ${data.persona} - ${personaDesc}`);
    console.log(`[Project ${id}] Script: ${safeScript}`);
    console.log(`[Project ${id}] Persona image: ${personaImagePath || 'None'}`);
    console.log(`[Project ${id}] Product image: ${productImagePath || 'None'}`);

    if (personaImagePath) {
      console.log(`[Project ${id}] Step 1: Generating enhanced base image from persona photo...`);

      const imagePrompt = productImagePath
        ? `Transform this photo into a professional portrait video scene. The person should LOOK LIKE the uploaded photo. Keep the face, identity, gender, age, ethnicity EXACTLY the same. Add the product naturally into the scene. Person type: ${personaDesc}. Product: ${data.productName} by ${data.brandName}. High quality, photorealistic, ${aspectRatio} format.`
        : `Transform this photo into a professional portrait video scene. The person should LOOK LIKE the uploaded photo. Keep the face, identity, gender, age, ethnicity EXACTLY the same. Person type: ${personaDesc}. Product: ${data.productName} by ${data.brandName}. High quality, photorealistic, ${aspectRatio} format.`;

      let imgCmd = `cmd /c npx pixverse create image --prompt "${imagePrompt}" --model seedream-5.0-lite --quality 2160p --aspect-ratio ${aspectRatio} --json`;

      if (productImagePath) {
        imgCmd += ` --images "${personaImagePath}" "${productImagePath}"`;
      } else {
        imgCmd += ` --image "${personaImagePath}"`;
      }

      console.log(`[Project ${id}] Executing image command:`, imgCmd);
      const { stdout: imgStdout } = await execPromise(imgCmd, { cwd: __dirname });
      console.log(`[Project ${id}] Image command raw output:`, imgStdout);

      const imgJsonMatch = imgStdout.match(/\{[\s\S]*\}/);
      if (!imgJsonMatch) throw new Error("No JSON found in image output. Output: " + imgStdout);

      const imgResult = JSON.parse(imgJsonMatch[0]);
      const imageUrl = imgResult.image_url || imgResult.url;
      if (!imageUrl) throw new Error("No image URL returned from PixVerse");

      console.log(`[Project ${id}] Step 2: Generating multi-shot video (4-8 shots, 5-8 sec each)...`);
      
      const vidPrompt = `Please create a professional TikTok-style promotional video for ${data.productName} by ${data.brandName}.

Break this video into 6 shots with these specifications:

SHOT 1 - INTRODUCTION
- Scene: Person enters frame with a warm smile and waves to camera
- Camera: Medium shot, slight push in
- Subject action: Welcoming gesture, friendly smile, eye contact
- Duration: 5 seconds
- Aspect ratio: 9:16

SHOT 2 - PRODUCT REVEAL  
- Scene: Person holds up the ${data.productName} product, showcasing it to camera
- Camera: Medium close-up, focus on product and face
- Subject action: Presents product with both hands, points at key features
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 3 - FEATURE HIGHLIGHT
- Scene: Close-up on person's face while explaining product benefits
- Camera: Close-up, tight framing
- Subject action: Speaking clearly, nodding, expressing enthusiasm
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 4 - DEMONSTRATION
- Scene: Person demonstrates product use, full body visible
- Camera: Wide shot, full body
- Subject action: Active demonstration, natural hand movements
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 5 - BENEFITS
- Scene: Person gestures to highlight product quality
- Camera: Medium shot
- Subject action: Pointing at product details, confident posture
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 6 - CALL TO ACTION
- Scene: Person smiles warmly, points to buy button
- Camera: Medium close-up
- Subject action: Direct eye contact, enthusiastic CTA gesture
- Duration: 6 seconds
- Aspect ratio: 9:16

IMPORTANT INSTRUCTIONS:
- Person identity: ${personaDesc}
- Keep person's face, gender, age EXACTLY as shown - DO NOT change
- Speaking script: "${safeScript}"
- Natural animations: blinking, head movements, lip sync
- Professional TikTok influencer style
- Total duration: 30+ seconds
- Model: v6, Quality: 720p for draft
- Animate naturally with lip sync to speech
- DO NOT change the person's appearance or identity`;
      
      const vidCmd = `cmd /c npx pixverse create video --prompt "${vidPrompt}" --image "${imageUrl}" --model v6 --quality 720p --aspect-ratio 9:16 --multi-shot --json`;
      console.log(`[Project ${id}] Executing multi-shot video command:`, vidCmd);

      const { stdout: vidStdout } = await execPromise(vidCmd, { cwd: __dirname });
      console.log(`[Project ${id}] Video command raw output:`, vidStdout);

      let videoId = null;
      let finalVideoUrl = null;
      
      const vidJsonMatch = vidStdout.match(/\{[\s\S]*\}/);
      if (vidJsonMatch) {
        const vidResult = JSON.parse(vidJsonMatch[0]);
        console.log(`[Project ${id}] Video result parsed:`, JSON.stringify(vidResult));
        videoId = vidResult.video_id || vidResult.id;
        finalVideoUrl = vidResult.url || vidResult.video_url || (vidResult.video && vidResult.video.url);
      } else {
        const textVideoIdMatch = vidStdout.match(/video_id:\s*(\d+)/);
        if (textVideoIdMatch) {
          videoId = textVideoIdMatch[1];
          console.log(`[Project ${id}] Video ID extracted from text:`, videoId);
        } else {
          throw new Error("No video ID found in output. Output: " + vidStdout);
        }
      }

      if (!finalVideoUrl && videoId) {
          console.log(`[Project ${id}] Step 3: Getting Asset URL for ID ${videoId}...`);
          
          console.log(`[Project ${id}] Step 4: Upscaling to final quality (1080p)...`);
          const upscaleCmd = `cmd /c npx pixverse create upscale --video "${videoId}" --quality 1080p --json`;
          const { stdout: upscaleStdout } = await execPromise(upscaleCmd, { cwd: __dirname });
          console.log(`[Project ${id}] Upscale raw output:`, upscaleStdout);
          
          const upscaleMatch = upscaleStdout.match(/\{[\s\S]*\}/);
          let finalVideoId = videoId;
          if (upscaleMatch) {
            const upscaleResult = JSON.parse(upscaleMatch[0]);
            finalVideoId = upscaleResult.video_id || upscaleResult.id || videoId;
          }
          
          console.log(`[Project ${id}] Step 5: Extending video to 30+ seconds...`);
          const extendCmd = `cmd /c npx pixverse create extend --video "${finalVideoId}" --json`;
          const { stdout: extendStdout } = await execPromise(extendCmd, { cwd: __dirname });
          console.log(`[Project ${id}] Extend raw output:`, extendStdout);
          
          const extendMatch = extendStdout.match(/\{[\s\S]*\}/);
          if (extendMatch) {
            const extendResult = JSON.parse(extendMatch[0]);
            finalVideoId = extendResult.video_id || extendResult.id || finalVideoId;
          } else {
            const extendTextMatch = extendStdout.match(/video_id:\s*(\d+)/);
            if (extendTextMatch) {
              finalVideoId = extendTextMatch[1];
            }
          }
          
          const assetCmd = `cmd /c npx pixverse asset download "${finalVideoId}" --json`;
          const { stdout: assetStdout } = await execPromise(assetCmd, { cwd: __dirname });
          console.log(`[Project ${id}] Asset command raw output:`, assetStdout);

          const assetJsonMatch = assetStdout.match(/\{[\s\S]*\}/);
          if (assetJsonMatch) {
              const assetResult = JSON.parse(assetJsonMatch[0]);
              finalVideoUrl = assetResult.url || assetResult.video_url;
              console.log(`[Project ${id}] Asset URL extracted:`, finalVideoUrl);
          }
      }

      if (!finalVideoUrl) {
        throw new Error("Failed to get video URL from PixVerse response");
      }

      console.log(`[Project ${id}] Generation successful:`, finalVideoUrl);
      db.run(`UPDATE projects SET resultMediaUrl = ?, status = ? WHERE id = ?`, [finalVideoUrl, 'completed', id]);
    } else {
      console.log(`[Project ${id}] No custom persona image, using Text-to-Image-to-Video pipeline...`);

      const personaDesc = data.persona === 'paijo'
        ? 'Indonesian handsome man, male, with neat beard, corporate professional, EXACT male gender'
        : 'Indonesian beautiful woman, female, with long black hair, professional, EXACT female gender';

      const clothingDesc = data.clothing === 'custom' ? data.customClothing : data.clothing;

      console.log(`[Project ${id}] Step 1: Generating base image from text...`);
      console.log(`[Project ${id}] Persona: ${data.persona} - ${personaDesc}`);
      console.log(`[Project ${id}] Script: ${safeScript}`);
      
      const imagePrompt = `Professional portrait scene. The person MUST be ${personaDesc}. DO NOT make the person female if male or male if female. Wearing ${clothingDesc}. Holding product ${data.productName} by ${data.brandName}. Looking at camera. High quality, ${aspectRatio} format. The person's gender, face shape and features must be EXACTLY as specified - NOT changed.`;

      let imgCmd = `cmd /c npx pixverse create image --prompt "${imagePrompt}" --model seedream-5.0-lite --quality 2160p --aspect-ratio ${aspectRatio} --json`;

      if (productImagePath) {
        imgCmd += ` --image "${productImagePath}"`;
      }

      console.log(`[Project ${id}] Executing image command:`, imgCmd);
      const { stdout: imgStdout } = await execPromise(imgCmd, { cwd: __dirname });
      console.log(`[Project ${id}] Image command raw output:`, imgStdout);

      const imgJsonMatch = imgStdout.match(/\{[\s\S]*\}/);
      if (!imgJsonMatch) throw new Error("No JSON found in image output. Output: " + imgStdout);

      const imgResult = JSON.parse(imgJsonMatch[0]);
      const imageUrl = imgResult.image_url || imgResult.url;
      if (!imageUrl) throw new Error("No image URL returned from PixVerse");

      console.log(`[Project ${id}] Step 2: Generating multi-shot video...`);
      
      const vidPrompt = `Please create a professional TikTok-style promotional video for ${data.productName} by ${data.brandName}.

Break this video into 6 shots with these specifications:

SHOT 1 - INTRODUCTION
- Scene: Person enters frame with a warm smile and waves to camera
- Camera: Medium shot, slight push in
- Subject action: Welcoming gesture, friendly smile, eye contact
- Duration: 5 seconds
- Aspect ratio: 9:16

SHOT 2 - PRODUCT REVEAL  
- Scene: Person holds up the ${data.productName} product, showcasing it to camera
- Camera: Medium close-up, focus on product and face
- Subject action: Presents product with both hands, points at key features
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 3 - FEATURE HIGHLIGHT
- Scene: Close-up on person's face while explaining product benefits
- Camera: Close-up, tight framing
- Subject action: Speaking clearly, nodding, expressing enthusiasm
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 4 - DEMONSTRATION
- Scene: Person demonstrates product use, full body visible
- Camera: Wide shot, full body
- Subject action: Active demonstration, natural hand movements
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 5 - BENEFITS
- Scene: Person gestures to highlight product quality
- Camera: Medium shot
- Subject action: Pointing at product details, confident posture
- Duration: 6 seconds
- Aspect ratio: 9:16

SHOT 6 - CALL TO ACTION
- Scene: Person smiles warmly, points to buy button
- Camera: Medium close-up
- Subject action: Direct eye contact, enthusiastic CTA gesture
- Duration: 6 seconds
- Aspect ratio: 9:16

IMPORTANT INSTRUCTIONS:
- Person identity: ${personaDesc}
- Keep person's face, gender, age EXACTLY as shown - DO NOT change
- Speaking script: "${safeScript}"
- Natural animations: blinking, head movements, lip sync
- Professional TikTok influencer style
- Total duration: 30+ seconds
- Model: v6, Quality: 720p for draft
- Animate naturally with lip sync to speech
- DO NOT change the person's appearance or identity`;
      const vidCmd = `cmd /c npx pixverse create video --prompt "${vidPrompt}" --image "${imageUrl}" --model v6 --quality 720p --aspect-ratio 9:16 --multi-shot --json`;
      console.log(`[Project ${id}] Executing video command:`, vidCmd);

      const { stdout: vidStdout } = await execPromise(vidCmd, { cwd: __dirname });
      console.log(`[Project ${id}] Video command raw output:`, vidStdout);

      let videoId = null;
      let finalVideoUrl = null;
      
      const vidJsonMatch = vidStdout.match(/\{[\s\S]*\}/);
      if (vidJsonMatch) {
        const vidResult = JSON.parse(vidJsonMatch[0]);
        videoId = vidResult.video_id || vidResult.id;
        finalVideoUrl = vidResult.url || vidResult.video_url || (vidResult.video && vidResult.video.url);
      } else {
        const textVideoIdMatch = vidStdout.match(/video_id:\s*(\d+)/);
        if (textVideoIdMatch) {
          videoId = textVideoIdMatch[1];
          console.log(`[Project ${id}] Video ID extracted from text:`, videoId);
        } else {
          throw new Error("No video ID found in output. Output: " + vidStdout);
        }
      }

      if (!finalVideoUrl && videoId) {
          console.log(`[Project ${id}] Step 3: Upscaling to 1080p...`);
          const upscaleCmd = `cmd /c npx pixverse create upscale --video "${videoId}" --quality 1080p --json`;
          const { stdout: upscaleStdout } = await execPromise(upscaleCmd, { cwd: __dirname });
          
          let finalVideoId = videoId;
          const upscaleMatch = upscaleStdout.match(/\{[\s\S]*\}/);
          if (upscaleMatch) {
            const upscaleResult = JSON.parse(upscaleMatch[0]);
            finalVideoId = upscaleResult.video_id || upscaleResult.id || videoId;
          }
          
          console.log(`[Project ${id}] Step 4: Extending video to 30+ seconds...`);
          const extendCmd = `cmd /c npx pixverse create extend --video "${finalVideoId}" --json`;
          const { stdout: extendStdout } = await execPromise(extendCmd, { cwd: __dirname });
          console.log(`[Project ${id}] Extend raw output:`, extendStdout);
          
          const extendMatch = extendStdout.match(/\{[\s\S]*\}/);
          if (extendMatch) {
            const extendResult = JSON.parse(extendMatch[0]);
            finalVideoId = extendResult.video_id || extendResult.id || finalVideoId;
          } else {
            const extendTextMatch = extendStdout.match(/video_id:\s*(\d+)/);
            if (extendTextMatch) {
              finalVideoId = extendTextMatch[1];
            }
          }
          
          const assetCmd = `cmd /c npx pixverse asset download "${finalVideoId}" --json`;
          const { stdout: assetStdout } = await execPromise(assetCmd, { cwd: __dirname });
          console.log(`[Project ${id}] Asset command raw output:`, assetStdout);

          const assetJsonMatch = assetStdout.match(/\{[\s\S]*\}/);
          if (assetJsonMatch) {
              const assetResult = JSON.parse(assetJsonMatch[0]);
              finalVideoUrl = assetResult.url || assetResult.video_url;
          }
      }

      if (!finalVideoUrl) {
        throw new Error("Failed to get video URL from PixVerse response");
      }

      console.log(`[Project ${id}] Generation successful:`, finalVideoUrl);
      db.run(`UPDATE projects SET resultMediaUrl = ?, status = ? WHERE id = ?`, [finalVideoUrl, 'completed', id]);
    }

  } catch (error) {
    console.error(`[Project ${id}] PixVerse pipeline error:`, error);
    console.error("Full error details:", error);

    const fallbackUrl = `http://localhost:${port}/media/fallback.mp4`;
    db.run(`UPDATE projects SET resultMediaUrl = ?, status = ? WHERE id = ?`, [fallbackUrl, 'completed', id]);
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
