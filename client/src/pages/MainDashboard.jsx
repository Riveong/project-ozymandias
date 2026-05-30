import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Loader2, CheckCircle, ShoppingBag, Sparkles, ArrowRight, ArrowLeft, Heart, MessageCircle, Download, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MainDashboard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    persona: 'paijo',
    clothing: 'casual',
    customClothing: '',
    tone: 'friendly',
    brandName: '',
    productName: '',
    description: '',
    ctaLink: ''
  });
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [personaImage, setPersonaImage] = useState(null);
  const [personaImagePreview, setPersonaImagePreview] = useState(null);

  const [status, setStatus] = useState('idle');
  const [projectId, setProjectId] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let interval;
    if (projectId && status !== 'idle' && status !== 'completed') {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:5001/api/projects/${projectId}`);
          setStatus(res.data.status);
          if (res.data.status === 'completed') {
            setResult(res.data);
            clearInterval(interval);
          }
        } catch (err) {
          console.error(err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [projectId, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'product') {
        setProductImage(file);
        setProductImagePreview(URL.createObjectURL(file));
      } else {
        setPersonaImage(file);
        setPersonaImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.persona === 'custom' && !personaImage) {
        alert("Please upload your custom persona photo first.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.clothing === 'custom' && !formData.customClothing) {
        alert("Please describe your custom clothing.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brandName || !formData.productName || !formData.description || !formData.ctaLink || !productImage) {
      alert("Please fill all required fields (including product photo).");
      return;
    }
    
    setStatus('script_generating');
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('productImage', productImage);
      if (formData.persona === 'custom' && personaImage) {
        data.append('personaImage', personaImage);
      }
      
      const response = await axios.post('http://localhost:5001/api/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.id) {
        setProjectId(response.data.id);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
      setStatus('idle');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setProjectId(null);
    setResult(null);
    setProductImage(null);
    setProductImagePreview(null);
    setPersonaImage(null);
    setPersonaImagePreview(null);
    setStep(1);
    setFormData({
      persona: 'paijo',
      clothing: 'casual',
      customClothing: '',
      tone: 'friendly',
      brandName: '',
      productName: '',
      description: '',
      ctaLink: ''
    });
  };

  return (
    <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
      
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 flex-shrink-0 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">Ozymandias AI</span>
        </Link>
        <div className="hidden sm:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
          <button onClick={handleReset} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            + Create
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:flex w-1/2 relative bg-blue-600 overflow-hidden flex-col">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-screen filter blur-[120px] opacity-60"></div>
            <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-60"></div>
            <div className="absolute -bottom-[10%] left-[20%] w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] opacity-60"></div>
          </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="relative z-10 flex flex-col items-center justify-center h-full w-full p-12 text-center"
            >
              <div className="w-full max-w-md h-96 border-4 border-dashed border-white/30 rounded-3xl flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm text-white shadow-xl">
                <Sparkles className="w-12 h-12 mb-4 text-cyan-200" />
                <p className="text-lg font-medium text-blue-50">Your AI Persona result<br/>will appear here</p>
              </div>
            </motion.div>
          )}

          {(status === 'script_generating' || status === 'video_generating') && (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="relative z-10 flex flex-col items-center justify-center h-full w-full bg-blue-900/40 backdrop-blur-sm absolute inset-0"
            >
              <Loader2 className="w-16 h-16 text-white animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Processing AI...</h2>
              <p className="text-blue-200">
                {status === 'script_generating' ? 'Writing engaging promotional script' : 'Rendering AI Persona...'}
              </p>
            </motion.div>
          )}

          {status === 'completed' && result && (
            <motion.div 
              key="completed" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="relative z-10 w-full h-full bg-gray-900 flex items-center justify-center p-8"
            >
              <div className="relative w-[320px] h-[568px] sm:w-[350px] sm:h-[622px] bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-800">
                <video src={result.resultMediaUrl} autoPlay loop muted className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>
                
                <div className="absolute bottom-20 right-3 flex flex-col items-center space-y-5 pointer-events-auto">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-1 border border-white/30 overflow-hidden p-0.5">
                      <img src={result.personaImageUrl || `https://ui-avatars.com/api/?name=${result.brandName}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-md">12K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition">
                      <MessageCircle className="w-5 h-5 fill-current" />
                    </button>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-md">104</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <a href={result.resultMediaUrl} download="ai-ambassador.mp4" target="_blank" rel="noreferrer" className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition">
                      <Download className="w-5 h-5" />
                    </a>
                    <span className="text-white text-[10px] font-bold mt-1 drop-shadow-md">Save</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-3 right-16 text-white pointer-events-auto">
                  <h3 className="font-bold text-base mb-1 drop-shadow-md">@{result.brandName.toLowerCase().replace(/\s+/g, '')}</h3>
                  <p className="text-sm line-clamp-2 mb-3 text-gray-100 drop-shadow-md">"{result.script}"</p>
                  
                  <a href={result.ctaLink} target="_blank" rel="noreferrer" className="flex items-center bg-[#f0a500] text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-[#d99500] transition shadow-lg w-fit">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy {result.productName}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto h-full relative">
          
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-8">
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Create AI Promotion</h2>
            <p className="text-gray-500 mb-8 text-lg">
              Step {status === 'completed' ? 3 : step} of 3: {step === 1 ? 'Choose Persona' : step === 2 ? 'Clothing & Tone' : 'Product Details'}
            </p>

            {status !== 'completed' && (
              <div className="flex space-x-2 mb-10">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-blue-600' : 'bg-gray-100'}`} 
                  />
                ))}
              </div>
            )}

          {status === 'completed' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-3xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Generation Successful!</h3>
              <p className="text-gray-600 mb-8 text-lg">Your promotional media is ready and can be viewed in the left panel.</p>
              <div className="flex flex-col space-y-3">
                <a 
                  href={result.resultMediaUrl} 
                  download="ai-ambassador.mp4" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full flex justify-center items-center bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-lg text-lg"
                >
                  <Download className="w-5 h-5 mr-2" /> Download Video
                </a>
                <button 
                  onClick={handleReset} 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-lg"
                >
                  Create New Project
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait" custom={step}>
                
                {step === 1 && (
                  <motion.div 
                    key="step1" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Persona</label>
                      <select 
                        name="persona" 
                        value={formData.persona} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                      >
                        <option value="paijo">Paijo (Male, handsome, corporate)</option>
                        <option value="mbaijo">Mbaijo (Female, black hair, professional)</option>
                        <option value="custom">Make your own (Upload Your Photo)</option>
                      </select>
                    </div>
                    
                    {formData.persona === 'custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 mt-2">Upload Your Photo (Persona)</label>
                        <div className="flex justify-center px-6 py-8 border-2 border-gray-300 border-dashed rounded-xl bg-white hover:bg-gray-50 transition-colors relative cursor-pointer group">
                          <div className="space-y-1 text-center">
                            {personaImagePreview ? (
                              <img src={personaImagePreview} alt="Persona Preview" className="mx-auto h-32 object-cover rounded-lg shadow-sm" />
                            ) : (
                              <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            )}
                            <div className="flex text-sm text-gray-600 justify-center mt-3">
                              <span className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-700">
                                {personaImagePreview ? 'Change Photo' : 'Upload Photo'}
                              </span>
                            </div>
                          </div>
                          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'persona')} accept="image/*" />
                        </div>
                      </motion.div>
                    )}

                    <div className="pt-6">
                      <button type="button" onClick={handleNext} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                        Continue <ArrowRight className="ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Clothing</label>
                      <select 
                        name="clothing" 
                        value={formData.clothing} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                      >
                        <option value="casual">Casual</option>
                        <option value="formal">Vest and Formal</option>
                        <option value="custom">Make your own</option>
                      </select>
                    </div>

                    {formData.clothing === 'custom' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Clothing Description</label>
                        <input 
                          type="text" 
                          name="customClothing" 
                          value={formData.customClothing} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base" 
                          placeholder="E.g. White shirt with black leather jacket" 
                        />
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Speaking Tone</label>
                      <select 
                        name="tone" 
                        value={formData.tone} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base"
                      >
                        <option value="friendly">Friendly & Casual</option>
                        <option value="professional">Professional & Elegant</option>
                        <option value="hype">Hype & Energetic</option>
                      </select>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <button type="button" onClick={handleBack} className="w-1/3 flex justify-center items-center py-4 px-4 border border-gray-300 rounded-xl text-base font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all">
                        <ArrowLeft className="mr-2 w-5 h-5" /> Back
                      </button>
                      <button type="button" onClick={handleNext} className="w-2/3 flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                        Continue <ArrowRight className="ml-2 w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Brand Name</label>
                        <input 
                          type="text" 
                          name="brandName" 
                          value={formData.brandName} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                          placeholder="Brand Co" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Name</label>
                        <input 
                          type="text" 
                          name="productName" 
                          value={formData.productName} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                          placeholder="Running Shoes" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Brief Description</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                        rows="2" 
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm resize-none" 
                        placeholder="Mention key features..." 
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Purchase Link (CTA)</label>
                      <input 
                        type="url" 
                        name="ctaLink" 
                        value={formData.ctaLink} 
                        onChange={handleInputChange} 
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                        placeholder="https://shop.com/..." 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Product Photo</label>
                      <div className="flex justify-center px-6 py-6 border-2 border-gray-300 border-dashed rounded-xl bg-white hover:bg-gray-50 transition-colors relative cursor-pointer group">
                        <div className="space-y-1 text-center">
                          {productImagePreview ? (
                            <img src={productImagePreview} alt="Product Preview" className="mx-auto h-20 object-cover rounded-lg shadow-sm" />
                          ) : (
                            <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          )}
                          <div className="flex text-sm text-gray-600 justify-center mt-2">
                            <span className="relative cursor-pointer rounded-md font-bold text-blue-600 hover:text-blue-700">
                              {productImagePreview ? 'Change Photo' : 'Upload Product Photo'}
                            </span>
                          </div>
                        </div>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleImageChange(e, 'product')} accept="image/*" />
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <button type="button" onClick={handleBack} className="w-1/3 flex justify-center items-center py-4 px-4 border border-gray-300 rounded-xl text-base font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:opacity-50" disabled={status !== 'idle'}>
                        <ArrowLeft className="mr-2 w-5 h-5" /> Back
                      </button>
                      <button type="submit" disabled={status !== 'idle'} className="w-2/3 flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-200 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                        {status !== 'idle' ? <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Processing...</> : 'Generate AI Media'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </div>
        </div>

        <footer className="w-full px-8 py-6 border-t border-gray-100 mt-auto flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">© 2026 Ozymandias AI. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
      </div>
    </div>
  );
}
