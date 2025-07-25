import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-3">Acceptance of Terms</h3>
                  <p className="text-muted-foreground">
                    By accessing and using Primal4K Radio services, you accept and agree to be bound by these terms.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Use of Service</h3>
                  <p className="text-muted-foreground">
                    Guidelines for appropriate use of our radio streaming service, chat features, and website.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Content Guidelines</h3>
                  <p className="text-muted-foreground">
                    Rules regarding user-generated content in chat rooms and community interactions.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Intellectual Property</h3>
                  <p className="text-muted-foreground">
                    Information about copyrights, music licensing, and intellectual property rights.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    Details about service limitations and liability disclaimers.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Modifications</h3>
                  <p className="text-muted-foreground">
                    How and when these terms may be updated or modified.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, contact us at legal@primal4k.com
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;