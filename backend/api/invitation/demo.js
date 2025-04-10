useEffect(() => {
  const loadInvitation = async () => {
    try {
      if (id === 'demo') {
        // Mock invitation data for preview/demo mode
        setInvitation({
          names: {
            en: "John & Jane",
            ar: "جون وجين",
            hi: "जॉन और जेन",
            es: "Juan y Juana",
            zh: "约翰和简"
          },
          date: new Date(),
          time: "6:00 PM",
          theme: "middleEastern",
          colorPalette: "luxury",
          venue: {
            en: "The Grand Palace",
            ar: "القصر الكبير",
            hi: "द ग्रैंड पैलेस",
            es: "El Gran Palacio",
            zh: "大皇宫"
          },
          dressCode: {
            en: "Formal Attire",
            ar: "الزي الرسمي",
            hi: "औपचारिक पोशाक",
            es: "Vestimenta formal",
            zh: "正式服装"
          },
          rsvp: {
            phone: "+1234567890",
            website: "https://rsvp.example.com"
          },
          languages: ['en', 'ar', 'hi', 'es', 'zh']
        });
        setLoading(false);
        return;
      }

      // Fetch from backend if not demo
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/invitations/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch invitation. Status: ${response.status}`);
      }

      const data = await response.json();
      setInvitation(data);
    } catch (err) {
      console.error("Error loading invitation:", err);
      setError("Could not load the invitation. Please check the link or try again.");
    } finally {
      setLoading(false);
    }
  };

  loadInvitation();
}, [id]);
